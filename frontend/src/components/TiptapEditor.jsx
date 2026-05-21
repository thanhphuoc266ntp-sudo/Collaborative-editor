import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import EditorToolbar from "./EditorToolbar";
import "./editorStyles";

const TiptapEditor = ({
  ydoc,
  provider,
  status,
  canEdit = false,
  myRole = "viewer",
}) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
          bold: false,
          italic: false,
        }),
        Bold,
        Italic,
        Underline,
        Collaboration.configure({
          document: ydoc,
        }),
      ],

      editorProps: {
        attributes: {
          class: "tiptap-editor-content",
          spellcheck: "false",
        },

        handleKeyDown() {
          if (!canEdit) {
            return true;
          }

          return false;
        },

        handlePaste() {
          if (!canEdit) {
            return true;
          }

          return false;
        },

        handleDrop() {
          if (!canEdit) {
            return true;
          }

          return false;
        },
      },

      autofocus: canEdit,
      editable: Boolean(ydoc && provider && canEdit),
    },
    [ydoc, provider, canEdit],
  );

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(Boolean(ydoc && provider && canEdit));
  }, [editor, ydoc, provider, canEdit]);

  if (!ydoc || !provider) {
    return <div className="editor-loading">Đang kết nối tài liệu...</div>;
  }

  if (!editor) {
    return <div className="editor-loading">Đang tải trình soạn thảo...</div>;
  }

  return (
    <div className="editor-shell">
      <EditorToolbar
        editor={editor}
        status={status}
        canEdit={canEdit}
        myRole={myRole}
      />

      {!canEdit && (
        <div className="viewer-readonly-banner">
          Bạn đang xem tài liệu với quyền Viewer. Bạn chỉ có thể xem, không thể
          chỉnh sửa.
        </div>
      )}

      <div className="editor-scroll">
        <div className="a4-page">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
