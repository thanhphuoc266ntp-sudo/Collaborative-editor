import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import EditorToolbar from "./EditorToolbar";

const TiptapEditor = ({ ydoc, provider }) => {
  const [status, setStatus] = useState("Đang kết nối CRDT...");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
        undoRedo: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    editorProps: {
      attributes: {
        class: "editor-prosemirror",
      },
    },
  });

  useEffect(() => {
    if (!provider) return;

    const handleStatus = ({ status }) => {
      if (status === "connected") {
        setStatus("Đã kết nối CRDT realtime");
      } else if (status === "connecting") {
        setStatus("Đang kết nối...");
      } else {
        setStatus("Mất kết nối realtime");
      }
    };

    const handleSynced = () => {
      setStatus("Đã đồng bộ tài liệu");
    };

    provider.on("status", handleStatus);
    provider.on("synced", handleSynced);

    return () => {
      provider.off("status", handleStatus);
      provider.off("synced", handleSynced);
    };
  }, [provider]);

  const focusEditor = () => {
    if (!editor) return;
    editor.chain().focus().run();
  };

  if (!editor) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang chuẩn bị editor CRDT...</p>
      </div>
    );
  }

  return (
    <div className="editor-wrapper">
      <EditorToolbar editor={editor} status={status} />

      <div className="workspace">
        <div className="a4-page" onMouseDown={focusEditor}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
