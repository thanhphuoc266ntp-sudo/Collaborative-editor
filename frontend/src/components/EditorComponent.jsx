/**
 * EditorComponent.jsx — v2 (bugfix)
 *
 * FIX: WebSocket closed before connection / Y.Doc destroyed too early.
 *
 * Thứ tự khởi tạo ĐÚNG:
 * 1. Component mount
 * 2. useEffect chạy → tạo Y.Doc → tạo HocuspocusProvider
 * 3. setCollab({ ydoc, provider }) → state update → re-render
 * 4. Render TiptapEditor với collab đã sẵn sàng
 *
 * Nếu collab === null (giữa step 1 và 3): render loading, KHÔNG render TiptapEditor.
 * TiptapEditor nhận ydoc=undefined = crash "Cannot read properties of undefined (reading 'doc')".
 */

import React, { useState, useEffect, useRef } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";

export default function EditorComponent({
  documentId = "default-doc",
  websocketUrl = "ws://localhost:1234",
  currentUser = { name: "Người dùng", color: "#4f46e5" },
}) {
  const [collab, setCollab] = useState(null);
  // Ref để access collab hiện tại trong cleanup mà không cần thêm vào deps
  const collabRef = useRef(null);

  useEffect(() => {
    // Destroy instance cũ nếu documentId thay đổi
    if (collabRef.current) {
      collabRef.current.provider.destroy();
      collabRef.current.ydoc.destroy();
      collabRef.current = null;
      setCollab(null);
    }

    const ydoc = new Y.Doc();

    const provider = new HocuspocusProvider({
      url: websocketUrl,
      name: documentId,
      document: ydoc,
      /**
       * WebSocket error "connection failed" thường do server chưa chạy.
       * Dùng maxAttempts để không retry vô hạn trong dev.
       * Tăng lên khi deploy production.
       */
      maxAttempts: 5,
      quiet: false, // set true để tắt console warnings khi dev offline
    });

    const newCollab = { ydoc, provider };
    collabRef.current = newCollab;

    // Chỉ set state sau khi tạo xong cả hai
    setCollab(newCollab);

    return () => {
      provider.destroy();
      ydoc.destroy();
      collabRef.current = null;
      // Không setCollab(null) ở đây — component đang unmount, không cần re-render
    };
  }, [documentId, websocketUrl]);

  if (!collab) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "200px",
          fontFamily: "-apple-system, sans-serif",
          fontSize: "14px",
          color: "#9ca3af",
          gap: "8px",
        }}
      >
        Đang kết nối...
      </div>
    );
  }

  return (
    /**
     * key={documentId}: force unmount/remount TiptapEditor khi đổi document.
     * Đảm bảo useEditor không giữ state cũ từ Y.Doc của document trước.
     */
    <TiptapEditor
      key={documentId}
      ydoc={collab.ydoc}
      provider={collab.provider}
      currentUser={currentUser}
    />
  );
}
