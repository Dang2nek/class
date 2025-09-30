const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// 🔗 MongoDB Atlas URI (link của bạn gửi)
const uri = "mongodb+srv://class:class@class.i7mhwiv.mongodb.net/?retryWrites=true&w=majority&appName=class";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Kết nối MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
connectDB();

// ================== SAVE ALL ==================
app.post("/save", async (req, res) => {
  try {
    const db = client.db("classroom");
    const collection = db.collection("seating");

    await collection.deleteMany({});
    await collection.insertMany(req.body);

    res.json({ message: "✅ All data saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== SAVE ONE ==================
app.post("/saveOne", async (req, res) => {
  try {
    const db = client.db("classroom");
    const collection = db.collection("seating");

    const { group, table, seat, name } = req.body;

    await collection.updateOne(
      { group: parseInt(group), table: parseInt(table), seat: parseInt(seat) },
      { $set: { name } },
      { upsert: true }
    );

    res.json({ message: "✅ One seat updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== LOAD ==================
app.get("/load", async (req, res) => {
  try {
    const db = client.db("classroom");
    const collection = db.collection("seating");

    const data = await collection.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
