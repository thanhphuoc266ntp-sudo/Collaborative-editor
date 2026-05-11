require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 1410;

// --- ĐOẠN CODE CORS ĐÃ ĐƯỢC CẤP QUYỀN CHO VERCEL ---
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Link test ở máy tính
      "https://collaborative-editor-g296-delta.vercel.app", // Link Vercel chính thức
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
// ---------------------------------------------------

app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/documents", require("./routes/document"));

app.listen(PORT, () => console.log(`🚀 Server đang chạy tại port ${PORT}`));
