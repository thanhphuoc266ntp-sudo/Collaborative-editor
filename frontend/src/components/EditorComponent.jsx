import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";

const isValidMongoId = (id) => {
  return /^[a-f\d]{24}$/i.test(String(id || ""));
};

const getRealtimeToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

const EditorComponent = ({
  documentId,
  canEdit = false,
  myRole = "viewer",
}) => {
  const [status, setStatus] = useState("Đang kết nối...");
  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);

  const collabUrl = import.meta.env.VITE_COLLAB_URL;
  const hasValidDocumentId = isValidMongoId(documentId);

  useEffect(() => {
    if (!hasValidDocumentId) {
      setStatus("Chưa mở tài liệu");
      setYdoc(null);
      setProvider(null);
      return;
    }

    if (!collabUrl) {
      setStatus("Thiếu cấu hình realtime");
      setYdoc(null);
      setProvider(null);
      return;
    }

    const nextYdoc = new Y.Doc();

    const nextProvider = new HocuspocusProvider({
      url: collabUrl,
      name: String(documentId),
      document: nextYdoc,
      token: getRealtimeToken(),
      parameters: {
        documentId: String(documentId),
        role: String(myRole || "viewer"),
        canEdit: String(Boolean(canEdit)),
      },
    });

    const handleConnect = () => {
      setStatus(canEdit ? "Đã kết nối" : "Đã kết nối - chế độ chỉ xem");
    };

    const handleSynced = () => {
      setStatus(
        canEdit ? "Đã đồng bộ tài liệu" : "Đã đồng bộ - Viewer chỉ xem",
      );
    };

    const handleDisconnect = () => {
      setStatus("Mất kết nối");
    };

    const handleAuthenticationFailed = () => {
      setStatus("Lỗi xác thực realtime");
    };

    const handleStatus = (event) => {
      if (event?.status === "connected") {
        setStatus(canEdit ? "Đã kết nối" : "Đã kết nối - chế độ chỉ xem");
      }

      if (event?.status === "connecting") {
        setStatus("Đang kết nối...");
      }

      if (event?.status === "disconnected") {
        setStatus("Mất kết nối");
      }
    };

    nextProvider.on("connect", handleConnect);
    nextProvider.on("synced", handleSynced);
    nextProvider.on("disconnect", handleDisconnect);
    nextProvider.on("authenticationFailed", handleAuthenticationFailed);
    nextProvider.on("status", handleStatus);

    setYdoc(nextYdoc);
    setProvider(nextProvider);
    setStatus("Đang kết nối...");

    return () => {
      nextProvider.off("connect", handleConnect);
      nextProvider.off("synced", handleSynced);
      nextProvider.off("disconnect", handleDisconnect);
      nextProvider.off("authenticationFailed", handleAuthenticationFailed);
      nextProvider.off("status", handleStatus);

      nextProvider.destroy();
      nextYdoc.destroy();

      setYdoc(null);
      setProvider(null);
    };
  }, [documentId, collabUrl, hasValidDocumentId, canEdit, myRole]);

  if (!hasValidDocumentId) {
    return <div className="editor-loading">Không tìm thấy tài liệu hợp lệ</div>;
  }

  if (!collabUrl) {
    return (
      <div className="editor-loading">
        Thiếu biến môi trường VITE_COLLAB_URL
      </div>
    );
  }

  if (!ydoc || !provider) {
    return <div className="editor-loading">Đang khởi tạo editor...</div>;
  }

  return (
    <TiptapEditor
      ydoc={ydoc}
      provider={provider}
      status={status}
      canEdit={canEdit}
      myRole={myRole}
    />
  );
};

export default EditorComponent;
