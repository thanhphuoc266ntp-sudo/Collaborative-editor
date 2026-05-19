/**
 * EditorComponent.jsx
 *
 * ROOT CAUSE FIX:
 * - Y.Doc và HocuspocusProvider phải được tạo MỘT LẦN duy nhất cho mỗi documentId.
 * - Dùng useEffect với cleanup để destroy đúng cách khi unmount hoặc documentId đổi.
 * - Truyền `key={documentId}` xuống TiptapEditor để force remount sạch sẽ khi
 *   document thay đổi — tránh trạng thái cũ rò vào editor mới.
 * - KHÔNG tạo Y.Doc/Provider inline trong render (sẽ tạo mới mỗi lần re-render).
 */

import React, { useState, useEffect, useRef } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";

export default function EditorComponent({
  documentId = "default-doc",
  websocketUrl = "ws://localhost:1234",
  currentUser = { name: "Anonymous", color: "#4f46e5" },
}) {
  /**
   * Dùng state để lưu collab objects.
   * Khi documentId thay đổi → useEffect chạy → destroy cũ → tạo mới → setCollab.
   * `collab` là null trong thời gian chờ → render null để tránh TiptapEditor nhận
   * provider đã bị destroy.
   */
  const [collab, setCollab] = useState(null);

  // Ref để track provider/ydoc hiện tại cho cleanup
  const collabRef = useRef(null);

  useEffect(() => {
    // Destroy provider/ydoc cũ nếu có (khi documentId thay đổi)
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
      // Không reconnect vô hạn khi server chưa sẵn sàng
      maxAttempts: 10,
      onConnect: () => {
        console.log(`[Hocuspocus] Connected to "${documentId}"`);
      },
      onClose: ({ event }) => {
        console.log("[Hocuspocus] Disconnected", event?.code, event?.reason);
      },
    });

    const newCollab = { ydoc, provider };
    collabRef.current = newCollab;
    setCollab(newCollab);

    return () => {
      // Cleanup khi component unmount hoặc deps thay đổi
      provider.destroy();
      ydoc.destroy();
      collabRef.current = null;
    };
  }, [documentId, websocketUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!collab) {
    return (
      <div className="editor-loading">
        <span>Đang kết nối...</span>
      </div>
    );
  }

  return (
    /**
     * key={documentId} đảm bảo TiptapEditor unmount/remount hoàn toàn
     * khi chuyển sang document khác, tránh useEditor giữ state cũ.
     */
    <TiptapEditor
      key={documentId}
      ydoc={collab.ydoc}
      provider={collab.provider}
      currentUser={currentUser}
    />
  );
}
