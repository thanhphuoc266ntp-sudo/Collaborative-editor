require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 1410;

// --- CẤU HÌNH CORS SIÊU CẤP: CHẤP NHẬN MỌI NGUỒN ---
app.use(
  cors({
    origin: true, // Cho phép tất cả các domain (Vercel, localhost, ...) truy cập
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
