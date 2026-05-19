import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Underline from "@tiptap/extension-underline";
import EditorToolbar from "./EditorToolbar";

const TiptapEditor = ({ provider }) => {
  const editor = useEditor(
    {
      // QUAN TRỌNG: TUYỆT ĐỐI KHÔNG TRUYỀN `content` KHI DÙNG COLLABORATION
      extensions: [
        StarterKit.configure({
          // Tắt history mặc định vì Yjs sẽ tự quản lý history (undo/redo)
          history: false,
        }),
        Underline, // Nút U cần extension này
        Collaboration.configure({
          document: provider.document,
        }),
        // (Tùy chọn) Hiển thị con trỏ của người khác
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: "User " + Math.floor(Math.random() * 100),
            color: "#f783ac",
          },
        }),
      ],
    },
    [provider.document],
  );
  // Dependency array chứa provider.document đảm bảo editor không bị remount
  // trừ khi document thực sự thay đổi.

  return (
    <div className="tiptap-container">
      <EditorToolbar editor={editor} />

      {/* Wrapper a4-page. Đã CSS để không cản trở việc click và focus */}
      <div className="a4-page-wrapper">
        <div className="a4-page">
          <EditorContent editor={editor} className="editor-content" />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
