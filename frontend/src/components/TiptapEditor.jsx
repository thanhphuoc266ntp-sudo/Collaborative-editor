import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import EditorToolbar from "./EditorToolbar";
import "./editorStyles";

const TiptapEditor = ({ ydoc, status }) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
        }),
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
      },
      autofocus: false,
    },
    [ydoc],
  );

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handlePageMouseDown = (event) => {
    if (!editor) return;

    const clickedToolbar = event.target.closest(".toolbar");
    const clickedEditor = event.target.closest(".ProseMirror");

    if (clickedToolbar) return;

    if (!clickedEditor && event.target.classList.contains("a4-page")) {
      requestAnimationFrame(() => {
        editor.commands.focus("end");
      });
    }
  };

  if (!editor) {
    return <div className="editor-loading">Đang tải trình soạn thảo...</div>;
  }

  return (
    <div className="editor-shell">
      <EditorToolbar editor={editor} status={status} />

      <div className="editor-scroll">
        <div className="a4-page" onMouseDown={handlePageMouseDown}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
