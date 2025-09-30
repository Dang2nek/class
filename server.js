import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔗 Kết nối MongoDB Atlas
mongoose.connect("mongodb+srv://class:class@class.i7mhwiv.mongodb.net/?retryWrites=true&w=majority&appName=class", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Tạo schema & model
const SeatSchema = new mongoose.Schema({
  group: Number,
  table: Number,
  seat: Number,
  name: String
});
const Seat = mongoose.model("Seat", SeatSchema);

app.use(cors());
app.use(express.json());

// ✅ Trỏ đúng thư mục public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

// 🟢 Lưu 1 ô duy nhất
app.post("/saveOne", async (req, res) => {
  try {
    const { group, table, seat, name } = req.body;
    await Seat.findOneAndUpdate(
      { group, table, seat },
      { name },
      { upsert: true }
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
    for (let item of data) {
      await Seat.findOneAndUpdate(
        { group: item.group, table: item.table, seat: item.seat },
        { name: item.name },
        { upsert: true }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Load dữ liệu
app.get("/load", async (req, res) => {
  try {
    const data = await Seat.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Serve index.html khi truy cập /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server chạy tại http://localhost:${PORT}`);
});
