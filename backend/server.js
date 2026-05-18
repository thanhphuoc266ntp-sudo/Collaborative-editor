require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

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
    socket.join(documentId);
    console.log(`Socket ${socket.id} đã vào phòng ${documentId}`);
  });

  socket.on("send-changes", ({ documentId, content }) => {
    socket.to(documentId).emit("receive-changes", content);
  });

  socket.on("save-document", ({ documentId, content }) => {
    socket.to(documentId).emit("document-saved", content);
  });

  socket.on("disconnect", () => {
    console.log("Người dùng đã ngắt kết nối:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});
