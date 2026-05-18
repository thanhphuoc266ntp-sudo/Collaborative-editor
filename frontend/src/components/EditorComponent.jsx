import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

const COLLAB_URL =
  import.meta.env.VITE_COLLAB_URL ||
  "wss://collaborative-editor-zegd.onrender.com/collaboration";

const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    return {
      name: user?.displayName || user?.username || user?.email || "Người dùng",
      color: user?.color || "#4f46e5",
    };
  } catch (error) {
    return {
      name: "Người dùng",
      color: "#4f46e5",
    };
  }
};

const TiptapEditor = ({ ydoc, provider }) => {
  const currentUser = getCurrentUser();
  const [status, setStatus] = useState("Đang kết nối CRDT...");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: currentUser,
      }),
    ],
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

  if (!editor) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Đang chuẩn bị editor CRDT...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="editor-wrapper">
        <div className="toolbar">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={`tool-btn ${editor.isActive("bold") ? "is-active" : ""}`}
            title="In đậm"
          >
            <b>B</b>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={`tool-btn ${
              editor.isActive("italic") ? "is-active" : ""
            }`}
            title="In nghiêng"
          >
            <i>I</i>
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={`tool-btn ${
              editor.isActive("strike") ? "is-active" : ""
            }`}
            title="Gạch ngang"
          >
            <s>S</s>
          </button>

          <div className="divider"></div>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={`tool-btn text-btn ${
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }`}
          >
            H1
          </button>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`tool-btn text-btn ${
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }`}
          >
            H2
          </button>

          <div className="divider"></div>

          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={`tool-btn text-btn ${
              editor.isActive("bulletList") ? "is-active" : ""
            }`}
          >
            • Danh sách
          </button>

          <div className="save-status">{status}</div>
        </div>

        <div className="workspace">
          <div className="a4-page">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </>
  );
};

const EditorComponent = ({ documentId }) => {
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    const ydoc = new Y.Doc();

    const provider = new HocuspocusProvider({
      url: COLLAB_URL,
      name: documentId,
      document: ydoc,
      connect: true,
    });

    setNetwork({
      ydoc,
      provider,
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
      setNetwork(null);
    };
  }, [documentId]);

  if (!network) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Đang kết nối Hocuspocus...</p>
        </div>
      </>
    );
  }

  return <TiptapEditor ydoc={network.ydoc} provider={network.provider} />;
};

const styles = `
  .editor-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background-color: #f3f4f6;
  }

  .toolbar {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    gap: 4px;
    z-index: 10;
  }

  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: #4b5563;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }

  .tool-btn.text-btn {
    padding: 0 12px;
    font-weight: 600;
    font-size: 14px;
  }

  .tool-btn:hover {
    background-color: #f3f4f6;
  }

  .tool-btn:active {
    transform: scale(0.92);
  }

  .tool-btn.is-active {
    background-color: #e0e7ff;
    color: #4338ca;
    border: 1px solid #c7d2fe;
    font-weight: 700;
  }

  .divider {
    width: 1px;
    height: 20px;
    background-color: #e5e7eb;
    margin: 0 8px;
  }

  .save-status {
    margin-left: auto;
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }

  .workspace {
    flex: 1;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f3f4f6;
  }

  .a4-page {
    width: 210mm;
    min-height: 297mm;
    padding: 25.4mm;
    background: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 10px 15px -3px rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    border: 1px solid #e5e7eb;
  }

  .a4-page .ProseMirror {
    outline: none;
    min-height: 100%;
    color: #1f2937;
    font-size: 16px;
    line-height: 1.6;
  }

  .a4-page .ProseMirror p {
    margin-bottom: 1em;
  }

  .a4-page .ProseMirror h1,
  .a4-page .ProseMirror h2 {
    color: #111827;
    line-height: 1.3;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  .collaboration-cursor__caret {
    border-left: 1px solid #0ea5e9;
    border-right: 1px solid #0ea5e9;
    margin-left: -1px;
    margin-right: -1px;
    pointer-events: none;
    position: relative;
    word-break: normal;
  }

  .collaboration-cursor__label {
    border-radius: 3px 3px 3px 0;
    color: #ffffff;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    left: -1px;
    line-height: normal;
    padding: 2px 6px;
    position: absolute;
    top: -1.4em;
    user-select: none;
    white-space: nowrap;
  }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    background-color: #f3f4f6;
    color: #6b7280;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default EditorComponent;
