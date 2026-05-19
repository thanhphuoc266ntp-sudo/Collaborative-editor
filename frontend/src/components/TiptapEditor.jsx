import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import EditorToolbar from "./EditorToolbar";
import "./editorStyles.js";

const TiptapEditor = ({ ydoc, provider, status }) => {
  const editor = useEditor({
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
      },

      handleDOMEvents: {
        mousedown: () => {
          return false;
        },
      },
    },

    autofocus: false,
  });

  const focusEditor = (event) => {
    if (!editor) return;

    const isEditorArea = event.target.closest(".ProseMirror");
    const isToolbar = event.target.closest(".toolbar");

    if (isToolbar) return;

    if (!isEditorArea) {
      editor.commands.focus("end");
    }
  };

  return (
    <div className="editor-shell">
      <EditorToolbar editor={editor} status={status} />

      <div className="editor-scroll">
        <div className="a4-page" onMouseDown={focusEditor}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
