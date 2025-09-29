const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const dbName = "umlEditor";

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

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
