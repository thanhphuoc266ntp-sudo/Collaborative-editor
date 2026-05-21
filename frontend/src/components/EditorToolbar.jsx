import React, { useEffect, useState } from "react";
import ToolbarButton from "./ToolbarButton";

const EditorToolbar = ({
  editor,
  status,
  canEdit = false,
  myRole = "viewer",
}) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      forceUpdate((value) => value + 1);
    };

    editor.on("transaction", updateToolbar);
    editor.on("selectionUpdate", updateToolbar);
    editor.on("update", updateToolbar);
    editor.on("focus", updateToolbar);
    editor.on("blur", updateToolbar);

    updateToolbar();

    return () => {
      editor.off("transaction", updateToolbar);
      editor.off("selectionUpdate", updateToolbar);
      editor.off("update", updateToolbar);
      editor.off("focus", updateToolbar);
      editor.off("blur", updateToolbar);
    };
  }, [editor]);

  if (!editor) return null;

  const roleLabel =
    myRole === "owner"
      ? "Chủ sở hữu"
      : myRole === "editor"
        ? "Editor"
        : "Viewer";

  const runEditorCommand = (callback) => {
    if (!canEdit) return;

    callback();

    requestAnimationFrame(() => {
      editor.view.focus();
      forceUpdate((value) => value + 1);
    });
  };

  return (
    <div className={canEdit ? "toolbar" : "toolbar readonly-toolbar"}>
      <ToolbarButton
        title={canEdit ? "In đậm" : "Viewer không có quyền chỉnh sửa"}
        active={editor.isActive("bold")}
        disabled={!canEdit}
        onRun={() =>
          runEditorCommand(() => editor.chain().focus().toggleBold().run())
        }
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title={canEdit ? "In nghiêng" : "Viewer không có quyền chỉnh sửa"}
        active={editor.isActive("italic")}
        disabled={!canEdit}
        onRun={() =>
          runEditorCommand(() => editor.chain().focus().toggleItalic().run())
        }
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title={canEdit ? "Gạch chân" : "Viewer không có quyền chỉnh sửa"}
        active={editor.isActive("underline")}
        disabled={!canEdit}
        onRun={() =>
          runEditorCommand(() => editor.chain().focus().toggleUnderline().run())
        }
      >
        <u>U</u>
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title={canEdit ? "Tiêu đề H1" : "Viewer không có quyền chỉnh sửa"}
        active={editor.isActive("heading", { level: 1 })}
        className="text-btn"
        disabled={!canEdit}
        onRun={() =>
          runEditorCommand(() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          )
        }
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        title={canEdit ? "Tiêu đề H2" : "Viewer không có quyền chỉnh sửa"}
        active={editor.isActive("heading", { level: 2 })}
        className="text-btn"
        disabled={!canEdit}
        onRun={() =>
          runEditorCommand(() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          )
        }
      >
        H2
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title={canEdit ? "Danh sách" : "Viewer không có quyền chỉnh sửa"}
        active={editor.isActive("bulletList")}
        className="text-btn"
        disabled={!canEdit}
        onRun={() =>
          runEditorCommand(() =>
            editor.chain().focus().toggleBulletList().run(),
          )
        }
      >
        • Danh sách
      </ToolbarButton>

      <div className="save-status">
        {status}
        {!canEdit && ` · ${roleLabel} chỉ xem`}
      </div>
    </div>
  );
};

export default EditorToolbar;
