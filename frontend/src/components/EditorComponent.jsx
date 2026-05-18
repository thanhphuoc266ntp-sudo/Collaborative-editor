import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;

const EditorComponent = ({ documentId }) => {
  const socketRef = useRef(null);
  const saveTimerRef = useRef(null);
  const isRemoteChangeRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("Đang tải tài liệu...");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      if (isRemoteChangeRef.current) return;
      if (!socketRef.current || !documentId) return;

      const content = JSON.stringify(editor.getJSON());

      setSaveStatus("Đang lưu...");

      socketRef.current.emit("send-changes", {
        documentId,
        content,
      });

      clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(async () => {
        try {
          await fetch(`${API_URL}/api/documents/${documentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          });

          setSaveStatus("Đã lưu trên đám mây");
        } catch (error) {
          setSaveStatus("Lưu thất bại");
        }
      }, 800);
    },
  });

  useEffect(() => {
    if (!documentId || !editor) return;

    const loadDocument = async () => {
      try {
        setLoading(true);
        setSaveStatus("Đang tải tài liệu...");

        const response = await fetch(`${API_URL}/api/documents/${documentId}`);
        const data = await response.json();

        if (!data.success) {
          setSaveStatus("Không tìm thấy tài liệu");
          setLoading(false);
          return;
        }

        const savedContent = data.document.content;

        if (savedContent) {
          try {
            editor.commands.setContent(JSON.parse(savedContent));
          } catch (error) {
            editor.commands.setContent(savedContent);
          }
        } else {
          editor.commands.setContent("");
        }

        setSaveStatus("Đã lưu trên đám mây");
        setLoading(false);
      } catch (error) {
        setSaveStatus("Không thể tải tài liệu");
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId, editor]);

  useEffect(() => {
    if (!documentId || !editor) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-document", documentId);
    });

    socket.on("receive-changes", (content) => {
      if (!editor) return;

      isRemoteChangeRef.current = true;

      try {
        editor.commands.setContent(JSON.parse(content), false);
      } catch (error) {
        editor.commands.setContent(content || "", false);
      }

      setTimeout(() => {
        isRemoteChangeRef.current = false;
      }, 0);
    });

    socket.on("connect_error", () => {
      setSaveStatus("Mất kết nối realtime");
    });

    return () => {
      socket.disconnect();
    };
  }, [documentId, editor]);

  useEffect(() => {
    return () => {
      clearTimeout(saveTimerRef.current);
    };
  }, []);

  if (loading || !editor) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>{saveStatus}</p>
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

          <div className="save-status">{saveStatus}</div>
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
