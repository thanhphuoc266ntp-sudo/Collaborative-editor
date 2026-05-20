import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";

const isValidMongoId = (id) => {
  return /^[a-f\d]{24}$/i.test(String(id || ""));
};

const EditorComponent = ({ documentId }) => {
  const [status, setStatus] = useState("Đang kết nối...");

  const collabUrl = import.meta.env.VITE_COLLAB_URL;
  const hasValidDocumentId = isValidMongoId(documentId);
  const canConnect = Boolean(hasValidDocumentId && collabUrl);

  const ydoc = useMemo(() => {
    if (!canConnect) return null;
    return new Y.Doc();
  }, [canConnect, documentId]);

  const provider = useMemo(() => {
    if (!canConnect || !ydoc) return null;

    return new HocuspocusProvider({
      url: collabUrl,
      name: documentId,
      document: ydoc,
    });
  }, [canConnect, collabUrl, documentId, ydoc]);

  useEffect(() => {
    if (!hasValidDocumentId) {
      setStatus("Chưa mở tài liệu");
      return;
    }

    if (!collabUrl) {
      setStatus("Thiếu cấu hình realtime");
      return;
    }

    if (!provider) return;

    const handleConnect = () => {
      setStatus("Đã kết nối");
    };

    const handleSynced = () => {
      setStatus("Đã đồng bộ tài liệu");
    };

    const handleDisconnect = () => {
      setStatus("Mất kết nối");
    };

    const handleAuthenticationFailed = () => {
      setStatus("Lỗi xác thực realtime");
    };

    provider.on("connect", handleConnect);
    provider.on("synced", handleSynced);
    provider.on("disconnect", handleDisconnect);
    provider.on("authenticationFailed", handleAuthenticationFailed);

    return () => {
      provider.off("connect", handleConnect);
      provider.off("synced", handleSynced);
      provider.off("disconnect", handleDisconnect);
      provider.off("authenticationFailed", handleAuthenticationFailed);
      provider.destroy();
    };
  }, [provider, hasValidDocumentId, collabUrl]);

  useEffect(() => {
    return () => {
      if (ydoc) {
        ydoc.destroy();
      }
    };
  }, [ydoc]);

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

  return <TiptapEditor ydoc={ydoc} provider={provider} status={status} />;
};

export default EditorComponent;
