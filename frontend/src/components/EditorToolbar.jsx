import React, { useEffect, useState } from "react";

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

    return () => {
      editor.off("transaction", updateToolbar);
      editor.off("selectionUpdate", updateToolbar);
      editor.off("update", updateToolbar);
    };
  }, [editor]);

  if (!editor) return null;

  const runEditorCommand = (event, callback) => {
    event.preventDefault();
    event.stopPropagation();

    const { from, to } = editor.state.selection;

    callback(from, to);

    requestAnimationFrame(() => {
      forceUpdate((value) => value + 1);
    });
  };

  const runChain = (from, to) => {
    return editor
      .chain()
      .setTextSelection({ from, to })
      .focus(undefined, { scrollIntoView: false });
  };

  return (
    <div className="toolbar">
      <button
        type="button"
        onMouseDown={(event) =>
          runEditorCommand(event, (from, to) =>
            runChain(from, to).toggleBold().run(),
          )
        }
        className={`tool-btn ${editor.isActive("bold") ? "is-active" : ""}`}
        title="In đậm"
      >
        <b>B</b>
      </button>

      <button
        type="button"
        onMouseDown={(event) =>
          runEditorCommand(event, (from, to) =>
            runChain(from, to).toggleItalic().run(),
          )
        }
        className={`tool-btn ${editor.isActive("italic") ? "is-active" : ""}`}
        title="In nghiêng"
      >
        <i>I</i>
      </button>

      <button
        type="button"
        onMouseDown={(event) =>
          runEditorCommand(event, (from, to) =>
            runChain(from, to).toggleUnderline().run(),
          )
        }
        className={`tool-btn ${
          editor.isActive("underline") ? "is-active" : ""
        }`}
        title="Gạch chân"
      >
        <u>U</u>
      </button>

      <div className="divider"></div>

      <button
        type="button"
        onMouseDown={(event) =>
          runEditorCommand(event, (from, to) =>
            runChain(from, to).toggleHeading({ level: 1 }).run(),
          )
        }
        className={`tool-btn text-btn ${
          editor.isActive("heading", { level: 1 }) ? "is-active" : ""
        }`}
        title="Tiêu đề H1"
      >
        H1
      </button>

      <button
        type="button"
        onMouseDown={(event) =>
          runEditorCommand(event, (from, to) =>
            runChain(from, to).toggleHeading({ level: 2 }).run(),
          )
        }
        className={`tool-btn text-btn ${
          editor.isActive("heading", { level: 2 }) ? "is-active" : ""
        }`}
        title="Tiêu đề H2"
      >
        H2
      </button>

      <div className="divider"></div>

      <button
        type="button"
        onMouseDown={(event) =>
          runEditorCommand(event, (from, to) =>
            runChain(from, to).toggleBulletList().run(),
          )
        }
        className={`tool-btn text-btn ${
          editor.isActive("bulletList") ? "is-active" : ""
        }`}
        title="Danh sách"
      >
        • Danh sách
      </button>

      <div className="save-status">{status}</div>
    </div>
  );
};

export default EditorToolbar;
