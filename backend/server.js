require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 1410;

// --- ĐÃ NÂNG CẤP BẢO VỆ CORS ĐỂ KHÔNG BAO GIỜ BỊ CHẶN NỮA ---
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Link test ở máy tính
      "https://collaborative-editor-g296-delta.vercel.app", // Link Vercel cũ
      "https://collaborative-editor-inky.vercel.app", // <-- Đã cấp thẻ VIP cho link hiện tại của bạn!
    ],
    // Mẹo Pro: Nếu sau này bạn vẫn bị lỗi CORS do đổi link mới, hãy xóa cái mảng 'origin' ở trên đi và thay bằng một dòng ngắn gọn này:
    // origin: true,
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
