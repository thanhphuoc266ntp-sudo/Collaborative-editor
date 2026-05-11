import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

const TiptapEditor = ({ ydoc, provider, currentUser }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
    ],
  });

  if (!editor) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang chuẩn bị trang giấy...</p>
      </div>
    );
  }

  return (
    <div className="editor-wrapper">
      <div className="toolbar">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={`tool-btn ${editor.isActive("bold") ? "is-active" : ""}`}
          title="In đậm (Ctrl+B)"
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={`tool-btn ${editor.isActive("italic") ? "is-active" : ""}`}
          title="In nghiêng (Ctrl+I)"
        >
          <i style={{ fontFamily: "Georgia, serif" }}>I</i>
        </button>

        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={`tool-btn ${editor.isActive("strike") ? "is-active" : ""}`}
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
          className={`tool-btn text-btn ${editor.isActive("heading", { level: 1 }) ? "is-active" : ""}`}
          title="Tiêu đề chính"
        >
          H1
        </button>

        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`tool-btn text-btn ${editor.isActive("heading", { level: 2 }) ? "is-active" : ""}`}
          title="Tiêu đề phụ"
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
          className={`tool-btn text-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
          title="Danh sách dấu chấm"
        >
          <span style={{ fontSize: "16px", marginRight: "4px" }}>•</span> Danh
          sách
        </button>
      </div>

      <div className="workspace">
        <div className="a4-page">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

const EditorComponent = ({ documentId, currentUser }) => {
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://127.0.0.1:1234",
      documentId,
      ydoc,
    );

    setNetwork({ ydoc, provider });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [documentId]);

  return (
    <>
      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f3f4f6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        
        .editor-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          flex: 1;
        }

        .toolbar {
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

        .tool-btn.is-active:hover {
          background-color: #c7d2fe;
        }

        .divider {
          width: 1px;
          height: 20px;
          background-color: #e5e7eb;
          margin: 0 8px;
        }

        .workspace {
          flex: 1;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          padding: 40px 20px;
          background-color: #f3f4f6;
        }

        .workspace::-webkit-scrollbar { width: 10px; }
        .workspace::-webkit-scrollbar-track { background: transparent; }
        .workspace::-webkit-scrollbar-thumb { 
          background: #d1d5db; 
          border-radius: 5px; 
          border: 2px solid #f3f4f6; 
        }

        .a4-page {
          width: 210mm;
          min-height: 297mm;
          padding: 25.4mm;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
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

        .a4-page .ProseMirror p { margin-bottom: 1em; }
        .a4-page .ProseMirror h1, 
        .a4-page .ProseMirror h2 {
          color: #111827;
          line-height: 1.3;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
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

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="app-container">
        {network ? (
          <TiptapEditor
            ydoc={network.ydoc}
            provider={network.provider}
            currentUser={currentUser}
          />
        ) : (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Đang kết nối tới máy chủ...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default EditorComponent;
