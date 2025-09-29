const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// 👉 MongoDB Atlas URI
const uri = "mongodb+srv://class:class@class.i7mhwiv.mongodb.net/?retryWrites=true&w=majority&appName=class";
const client = new MongoClient(uri);
const dbName = "umlEditor";

// Serve file index.html khi vào "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API lưu UML
app.put("/api/diagram/:id", async (req, res) => {
  const id = req.params.id;
  const { uml } = req.body;
  try {
    await client.connect();
    const db = client.db(dbName);
    await db.collection("diagrams").updateOne(
      { _id: id },
      { $set: { uml } },
      { upsert: true }
    );
    res.json({ message: "Diagram saved" });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// API lấy UML
app.get("/api/diagram/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await client.connect();
    const db = client.db(dbName);
    const diagram = await db.collection("diagrams").findOne({ _id: id });
    res.json(diagram);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () => console.log("✅ Server chạy tại http://localhost:3000"));
