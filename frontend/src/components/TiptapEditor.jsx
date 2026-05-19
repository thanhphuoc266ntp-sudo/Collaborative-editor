import React, { useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import EditorToolbar from "./EditorToolbar";
import "./editorStyles";

const TiptapEditor = ({ ydoc, status }) => {
  const activeMarksRef = useRef({
    bold: false,
    italic: false,
    underline: false,
  });

  const buildMarks = (schema) => {
    const marks = [];

    if (activeMarksRef.current.bold && schema.marks.bold) {
      marks.push(schema.marks.bold.create());
    }

    if (activeMarksRef.current.italic && schema.marks.italic) {
      marks.push(schema.marks.italic.create());
    }

    if (activeMarksRef.current.underline && schema.marks.underline) {
      marks.push(schema.marks.underline.create());
    }

    return marks;
  };

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false,
          bold: false,
          italic: false,
          underline: false,
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

        handleTextInput(view, from, to, text) {
          const { state } = view;
          const { schema } = state;
          const marks = buildMarks(schema);

          const textNode = schema.text(text, marks);

          let transaction = state.tr.replaceWith(from, to, textNode);

          transaction = transaction.setSelection(
            TextSelection.create(transaction.doc, from + text.length),
          );

          transaction = transaction.setStoredMarks(marks);

          view.dispatch(transaction);

          return true;
        },
      },

      autofocus: true,
    },
    [ydoc],
  );

  if (!editor) {
    return <div className="editor-loading">Đang tải trình soạn thảo...</div>;
  }

  return (
    <div className="editor-shell">
      <EditorToolbar
        editor={editor}
        status={status}
        activeMarksRef={activeMarksRef}
        buildMarks={buildMarks}
      />

      <div className="editor-scroll">
        <div className="a4-page">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default TiptapEditor;
