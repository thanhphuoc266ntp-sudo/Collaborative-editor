import React, { useEffect, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { TextSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import EditorToolbar from "./EditorToolbar";
import "./editorStyles";

const USER_COLORS = [
  "#2563eb",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#6366f1",
];

const getStoredUserName = () => {
  return (
    localStorage.getItem("userName") ||
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "Người dùng"
  );
};

const getUserColor = (name) => {
  const text = String(name || "Người dùng");
  let hash = 0;

  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
};

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

  const currentUser = useMemo(() => {
    const name = getStoredUserName();

    return {
      name,
      color: getUserColor(name),
    };
  }, []);

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

  const editorExtensions = useMemo(() => {
    const extensions = [
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
    ];

    if (provider?.awareness) {
      extensions.push(
        CollaborationCursor.configure({
          provider,
          user: currentUser,
        }),
      );
    }

    return extensions;
  }, [ydoc, provider, currentUser]);

  const editor = useEditor(
    {
      extensions: editorExtensions,

      editorProps: {
        attributes: {
          class: "tiptap-editor-content",
          spellcheck: "false",
        },

        handleTextInput(view, from, to, text) {
          if (!canEdit) {
            return true;
          }

          if (from !== to) {
            return false;
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
    [editorExtensions, ydoc, provider, canEdit],
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

  useEffect(() => {
    if (!provider?.awareness) return;

    provider.awareness.setLocalStateField("user", currentUser);

    return () => {
      if (provider?.awareness) {
        provider.awareness.setLocalStateField("user", null);
      }
    };
  }, [provider, currentUser]);

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
