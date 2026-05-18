require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Document = require("./models/Document");

const app = express();
const PORT = process.env.PORT || 1410;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Collaborative Editor Backend is running",
  });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/documents", require("./routes/document"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Người dùng đã kết nối:", socket.id);

  socket.on("join-document", (documentId) => {
    if (!documentId) return;

    socket.join(documentId);
    console.log(`Socket ${socket.id} đã vào phòng ${documentId}`);
  });

  socket.on("send-changes", ({ documentId, content }) => {
    if (!documentId) return;

    socket.to(documentId).emit("receive-changes", content);
  });

  socket.on("save-document", async ({ documentId, content }) => {
    try {
      if (!documentId) return;

      await Document.findOneAndUpdate(
        { documentId },
        { content: content || "" },
        { new: true },
      );

      socket.to(documentId).emit("document-saved", content);
      console.log(`Đã lưu tài liệu ${documentId}`);
    } catch (error) {
      console.error("Lỗi lưu tài liệu bằng socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Người dùng đã ngắt kết nối:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});
