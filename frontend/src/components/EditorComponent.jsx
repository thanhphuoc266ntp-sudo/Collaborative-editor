import React, { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";

const EditorComponent = ({ documentId }) => {
  const [status, setStatus] = useState("Đang kết nối...");

  const ydoc = useMemo(() => {
    return new Y.Doc();
  }, [documentId]);

  const provider = useMemo(() => {
    if (!documentId) return null;

    return new HocuspocusProvider({
      url: import.meta.env.VITE_COLLAB_URL,
      name: documentId,
      document: ydoc,
    });
  }, [documentId, ydoc]);

  useEffect(() => {
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

    provider.on("connect", handleConnect);
    provider.on("synced", handleSynced);
    provider.on("disconnect", handleDisconnect);

    return () => {
      provider.off("connect", handleConnect);
      provider.off("synced", handleSynced);
      provider.off("disconnect", handleDisconnect);
      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  if (!documentId) {
    return <div className="editor-loading">Không tìm thấy tài liệu</div>;
  }

  return <TiptapEditor ydoc={ydoc} provider={provider} status={status} />;
};

export default EditorComponent;
