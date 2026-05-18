require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");
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

const startRealtimeServer = async () => {
  const { Hocuspocus } = await import("@hocuspocus/server");
  const { default: crossws } = await import("crossws/adapters/node");

  const hocuspocus = new Hocuspocus({
    name: "collaborative-editor-hocuspocus",

    async onConnect(data) {
      console.log("Hocuspocus client connected:", data.documentName);
    },

    async onDisconnect(data) {
      console.log("Hocuspocus client disconnected:", data.documentName);
    },
  });

  const ws = crossws({
    hooks: {
      open(peer) {
        const clientConnection = hocuspocus.handleConnection(
          peer.websocket,
          peer.request,
          {},
        );

        peer.hocuspocusConnection = clientConnection;
      },

      message(peer, message) {
        peer.hocuspocusConnection?.handleMessage(message.uint8Array());
      },

      close(peer, event) {
        peer.hocuspocusConnection?.handleClose({
          code: event.code,
          reason: event.reason,
        });
      },

      error(peer, error) {
        console.error("Hocuspocus WebSocket error:", error);
      },
    },
  });

  server.on("upgrade", (request, socket, head) => {
    if (request.url && request.url.startsWith("/collaboration")) {
      ws.handleUpgrade(request, socket, head);
    }
  });

  console.log("✅ Hocuspocus realtime server đã sẵn sàng tại /collaboration");
};

const io = new SocketIOServer(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket.IO người dùng đã kết nối:", socket.id);

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
    console.log("Socket.IO người dùng đã ngắt kết nối:", socket.id);
  });
});

startRealtimeServer()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Không thể khởi động Hocuspocus:", error);
    process.exit(1);
  });
