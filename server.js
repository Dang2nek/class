// Lưu 1 ô duy nhất
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

    res.json({ message: "One seat updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
