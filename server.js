import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔗 Kết nối MongoDB Atlas
mongoose.connect(
  "mongodb+srv://class:class@class.i7mhwiv.mongodb.net/classroom?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ✅ Kiểm tra kết nối
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected");
});
mongoose.connection.on("error", (err) => {
  console.log("❌ MongoDB connection error:", err);
});

// 🪑 Schema & Model
const SeatSchema = new mongoose.Schema({
  group: Number,
  table: Number,
  seat: Number,
  name: String,
});
const Seat = mongoose.model("Seat", SeatSchema);

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// 🟢 Lưu 1 ô duy nhất
app.post("/saveOne", async (req, res) => {
  try {
    const { group, table, seat, name } = req.body;

    if (!group || !table || !seat || name === undefined)
      return res.status(400).json({ error: "Thiếu dữ liệu" });

    await Seat.findOneAndUpdate(
      { group, table, seat },
      { name },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Lưu tất cả
app.post("/save", async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data))
      return res.status(400).json({ error: "Dữ liệu phải là array" });

    const operations = data.map((item) =>
      Seat.findOneAndUpdate(
        { group: item.group, table: item.table, seat: item.seat },
        { name: item.name },
        { upsert: true, new: true }
      )
    );

    await Promise.all(operations);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Load dữ liệu
app.get("/load", async (req, res) => {
  try {
    const data = await Seat.find({});
    res.json(data); // luôn trả về array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
