import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";
import "./editorStyles.css"; // Dùng file CSS chuẩn cho dễ tuỳ biến

const EditorComponent = ({ documentName = "my-room" }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    // 1. Khởi tạo Y.Doc và Provider MỘT LẦN DUY NHẤT
    const ydoc = new Y.Doc();
    const newProvider = new HocuspocusProvider({
      url: "ws://127.0.0.1:1234", // Thay bằng URL Hocuspocus server của bạn
      name: documentName,
      document: ydoc,
    });

    setProvider(newProvider);

    // 2. Cleanup đúng cách khi unmount
    return () => {
      newProvider.destroy();
      ydoc.destroy();
    };
  }, [documentName]);

  if (!provider) {
    return <div className="loading-editor">Đang kết nối...</div>;
  }

  return (
    <div className="editor-layout">
      <TiptapEditor provider={provider} />
    </div>
  );
};

export default EditorComponent;
