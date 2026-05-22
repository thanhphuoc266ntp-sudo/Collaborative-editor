import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
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
  const directName =
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    localStorage.getItem("fullName") ||
    localStorage.getItem("displayName");

  if (directName) {
    return directName;
  }

  const directEmail =
    localStorage.getItem("userEmail") || localStorage.getItem("email");

  if (directEmail) {
    return directEmail;
  }

  try {
    const userRaw = localStorage.getItem("user");

    if (userRaw) {
      const user = JSON.parse(userRaw);

      return (
        user.name ||
        user.fullName ||
        user.displayName ||
        user.username ||
        user.email ||
        "Người dùng"
      );
    }
  } catch {
    return "Người dùng";
  }

  return "Người dùng";
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
  const [conflictNotice, setConflictNotice] = useState("");

  const activeMarksRef = useRef({
    bold: false,
    italic: false,
    underline: false,
  });

  const conflictTimerRef = useRef(null);
  const lastLocalEditAtRef = useRef(0);

  const currentUser = useMemo(() => {
    const name = getStoredUserName();

    return {
      name,
      color: getUserColor(name),
    };
  }, []);

  const showConflictNotice = (message) => {
    setConflictNotice(message);

    if (conflictTimerRef.current) {
      clearTimeout(conflictTimerRef.current);
    }

    conflictTimerRef.current = setTimeout(() => {
      setConflictNotice("");
    }, 3000);
  };

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
        CollaborationCaret.configure({
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

        handleTextInput() {
          if (!canEdit) {
            return true;
          }

          lastLocalEditAtRef.current = Date.now();

          return false;
        },

        handleKeyDown() {
          if (!canEdit) {
            return true;
          }

          lastLocalEditAtRef.current = Date.now();

          return false;
        },

        handlePaste() {
          if (!canEdit) {
            return true;
          }

          lastLocalEditAtRef.current = Date.now();

          return false;
        },

        handleDrop() {
          if (!canEdit) {
            return true;
          }

          lastLocalEditAtRef.current = Date.now();

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

  useEffect(() => {
    if (!ydoc || !provider) return;

    const handleYjsUpdate = (update, origin) => {
      const now = Date.now();
      const isNearLocalEdit = now - lastLocalEditAtRef.current < 4000;

      const originName = String(origin?.constructor?.name || "").toLowerCase();

      const isRemoteUpdate =
        origin === provider ||
        originName.includes("provider") ||
        originName.includes("hocuspocus");

      if (isRemoteUpdate && isNearLocalEdit) {
        showConflictNotice("Đã xử lý xung đột chỉnh sửa bằng CRDT");
        return;
      }

      if (isRemoteUpdate) {
        showConflictNotice("Đã đồng bộ thay đổi từ người khác");
      }
    };

    ydoc.on("update", handleYjsUpdate);

    return () => {
      ydoc.off("update", handleYjsUpdate);

      if (conflictTimerRef.current) {
        clearTimeout(conflictTimerRef.current);
      }
    };
  }, [ydoc, provider]);

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

      {conflictNotice && (
        <div className="conflict-notice">{conflictNotice}</div>
      )}

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
