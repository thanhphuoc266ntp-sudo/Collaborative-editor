require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");

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
app.use("/api/folders", require("./routes/folder"));

const server = http.createServer(app);

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(String(id));
};

const startRealtimeServer = async () => {
  const { Hocuspocus } = await import("@hocuspocus/server");
  const { default: crossws } = await import("crossws/adapters/node");
  const Y = await import("yjs");

  const saveTimers = new Map();

  const saveYjsDocument = async (
    documentName,
    ydoc,
    reason = "ydoc-update",
  ) => {
    if (!documentName || !ydoc) {
      console.log("Thiếu documentName hoặc ydoc, bỏ qua lưu");
      return;
    }

    if (!isValidObjectId(documentName)) {
      console.log(
        "documentName không phải MongoDB ObjectId, bỏ qua lưu:",
        documentName,
      );
      return;
    }

    const state = Y.encodeStateAsUpdate(ydoc);
    const nextBuffer = Buffer.from(state);

    const oldDocument = await Document.findById(documentName);

    if (!oldDocument) {
      console.log(
        "Không tìm thấy document trong MongoDB, bỏ qua lưu:",
        documentName,
      );
      return;
    }

    const oldLength = oldDocument.yState ? oldDocument.yState.length : 0;
    const newLength = nextBuffer.length;

    console.log(
      `Chuẩn bị lưu yState: ${documentName}, old=${oldLength}, new=${newLength}, reason=${reason}`,
    );

    if (oldLength > 0 && newLength <= 56) {
      console.log(
        `Bỏ qua lưu state rỗng/quá nhỏ: ${documentName}, old=${oldLength}, new=${newLength}`,
      );
      return;
    }

    if (oldLength > 120 && newLength < oldLength * 0.5) {
      console.log(
        `Bỏ qua lưu vì state mới nhỏ bất thường: ${documentName}, old=${oldLength}, new=${newLength}`,
      );
      return;
    }

    const saved = await Document.findByIdAndUpdate(
      documentName,
      {
        $set: {
          yState: nextBuffer,
        },
      },
      {
        new: true,
      },
    );

    console.log(
      `Đã lưu yState: ${saved._id}, buffer length: ${
        saved.yState ? saved.yState.length : 0
      }, reason=${reason}`,
    );
  };

  const scheduleSave = (documentName, ydoc) => {
    if (!documentName || !ydoc) return;

    if (saveTimers.has(documentName)) {
      clearTimeout(saveTimers.get(documentName));
    }

    const timer = setTimeout(async () => {
      try {
        await saveYjsDocument(documentName, ydoc, "ydoc-update");
      } catch (error) {
        console.error("Lỗi lưu yState:", error);
      } finally {
        saveTimers.delete(documentName);
      }
    }, 1500);

    saveTimers.set(documentName, timer);
  };

  const hocuspocus = new Hocuspocus({
    name: "collaborative-editor-hocuspocus",

    async onConnect(data) {
      console.log("Hocuspocus connected:", data.documentName);
    },

    async onDisconnect(data) {
      console.log("Hocuspocus disconnected:", data.documentName);
      console.log("Không lưu khi disconnect để tránh ghi đè rỗng khi reload");
    },

    async onLoadDocument(data) {
      const documentName = data.documentName;

      console.log("onLoadDocument:", documentName);

      const ydoc = new Y.Doc();

      if (!documentName || !isValidObjectId(documentName)) {
        console.log(
          "documentName không hợp lệ, trả về Y.Doc rỗng:",
          documentName,
        );
        return ydoc;
      }

      const dbDocument = await Document.findById(documentName);

      if (!dbDocument) {
        console.log(
          "Không tìm thấy document, trả về Y.Doc rỗng:",
          documentName,
        );
        return ydoc;
      }

      const currentLength = dbDocument.yState ? dbDocument.yState.length : 0;

      console.log("yState trong Mongo:", currentLength, "bytes");

      if (dbDocument.yState && dbDocument.yState.length > 0) {
        Y.applyUpdate(ydoc, new Uint8Array(dbDocument.yState));
        console.log("Đã apply yState:", documentName);
      } else {
        console.log("Chưa có yState để load:", documentName);
      }

      ydoc.on("update", () => {
        console.log("Y.Doc update:", documentName);
        scheduleSave(documentName, ydoc);
      });

      return ydoc;
    },

    async onChange(data) {
      console.log("onChange:", data.documentName);

      if (data.document) {
        scheduleSave(data.documentName, data.document);
      }
    },

    async onStoreDocument(data) {
      console.log(
        "onStoreDocument fired nhưng không lưu trực tiếp:",
        data.documentName,
      );
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
      return;
    }

    socket.destroy();
  });

  console.log("Hocuspocus realtime server đã sẵn sàng tại /collaboration");
};

startRealtimeServer()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server đang chạy tại port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Không thể khởi động Hocuspocus:", error);
    process.exit(1);
  });
