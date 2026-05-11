const WebSocket = require("ws");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Danh sách các "ngõ" mà file utils có thể trốn (Node v24 + y-websocket v2)
const rootPath = process.cwd();
const searchPaths = [
  path.join(rootPath, "node_modules/y-websocket/bin/utils.js"),
  path.join(rootPath, "node_modules/y-websocket/bin/utils.cjs"),
  path.join(rootPath, "node_modules/y-websocket/dist/src/utils.js"),
  path.join(rootPath, "backend/node_modules/y-websocket/bin/utils.js"),
];

let setupWSConnection;

for (const p of searchPaths) {
  if (fs.existsSync(p)) {
    try {
      setupWSConnection = require(p).setupWSConnection;
      console.log(`✅ Đã tìm thấy "linh hồn" Yjs tại: ${p}`);
      break;
    } catch (e) {
      continue;
    }
  }
}

if (!setupWSConnection) {
  console.error(
    "❌ LỖI NGHIÊM TRỌNG: Không tìm thấy file utils của y-websocket.",
  );
  console.log(
    "👉 Giải pháp: Phước hãy mở thư mục 'node_modules/y-websocket' và chụp ảnh bên trong đó gửi mình nhé!",
  );
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Yjs Server is Running");
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (conn, req) => {
  setupWSConnection(conn, req);
});

server.listen(1234, () => {
  console.log("🚀 [YJS] HỆ THỐNG ĐÃ THÔNG MẠCH TẠI CỔNG 1234");
});
