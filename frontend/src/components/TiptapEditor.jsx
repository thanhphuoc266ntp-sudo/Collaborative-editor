import React, { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import EditorToolbar from "./EditorToolbar";
import "./editorStyles";

const SafeBold = Bold.extend({
  inclusive: false,
});

const SafeItalic = Italic.extend({
  inclusive: false,
});

const SafeUnderline = Underline.extend({
  inclusive: false,
});

const TiptapEditor = ({
  ydoc,
  provider,
  status,
  canEdit = false,
  myRole = "viewer",
}) => {
  const activeMarksRef = useRef({
    bold: false,
    italic: false,
    underline: false,
  });

  const buildMarks = (schema) => {
    const marks = [];

    if (!canEdit) {
      return marks;
    }

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
        }),
        SafeBold,
        SafeItalic,
        SafeUnderline,
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
          if (!canEdit) {
            return true;
          }

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

    if (!canEdit) {
      activeMarksRef.current = {
        bold: false,
        italic: false,
        underline: false,
      };
    }
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
        activeMarksRef={activeMarksRef}
        buildMarks={buildMarks}
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
