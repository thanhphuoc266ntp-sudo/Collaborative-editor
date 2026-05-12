require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 1410;

// --- CẤU HÌNH CORS "CHỦ TỊCH": CHẤP NHẬN TẤT CẢ CÁC LINK ---
app.use(
  cors({
    origin: true, // <--- Dòng này cực kỳ quan trọng: Cho phép mọi domain truy cập
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
// ---------------------------------------------------

app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/documents", require("./routes/document"));

app.listen(PORT, () => console.log(`🚀 Server đang chạy tại port ${PORT}`));
