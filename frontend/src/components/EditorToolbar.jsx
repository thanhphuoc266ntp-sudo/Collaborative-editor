import React, { useEffect, useState } from "react";
import ToolbarButton from "./ToolbarButton";

const EditorToolbar = ({ editor, status }) => {
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

    return () => {
      editor.off("transaction", updateToolbar);
      editor.off("selectionUpdate", updateToolbar);
      editor.off("update", updateToolbar);
      editor.off("focus", updateToolbar);
      editor.off("blur", updateToolbar);
    };
  }, [editor]);

  if (!editor) return null;

  const run = (callback) => {
    callback();
    requestAnimationFrame(() => {
      forceUpdate((value) => value + 1);
    });
  };

  return (
    <div
      className="toolbar"
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <ToolbarButton
        title="In đậm"
        active={editor.isActive("bold")}
        onRun={() => run(() => editor.chain().focus().toggleBold().run())}
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title="In nghiêng"
        active={editor.isActive("italic")}
        onRun={() => run(() => editor.chain().focus().toggleItalic().run())}
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title="Gạch chân"
        active={editor.isActive("underline")}
        onRun={() => run(() => editor.chain().focus().toggleUnderline().run())}
      >
        <u>U</u>
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title="Tiêu đề H1"
        active={editor.isActive("heading", { level: 1 })}
        className="text-btn"
        onRun={() =>
          run(() => editor.chain().focus().toggleHeading({ level: 1 }).run())
        }
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        title="Tiêu đề H2"
        active={editor.isActive("heading", { level: 2 })}
        className="text-btn"
        onRun={() =>
          run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())
        }
      >
        H2
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title="Danh sách"
        active={editor.isActive("bulletList")}
        className="text-btn"
        onRun={() => run(() => editor.chain().focus().toggleBulletList().run())}
      >
        • Danh sách
      </ToolbarButton>

      <div className="save-status">{status}</div>
    </div>
  );
};

export default EditorToolbar;
