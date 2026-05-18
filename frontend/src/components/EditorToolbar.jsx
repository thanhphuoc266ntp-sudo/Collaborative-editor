import React from "react";

const EditorToolbar = ({ editor, status }) => {
  const runEditorCommand = (event, command) => {
    event.preventDefault();
    event.stopPropagation();

    if (!editor) return;

    command();
  };

  return (
    <div className="toolbar">
      <button
        type="button"
        onMouseDown={(e) =>
          runEditorCommand(e, () => editor.chain().focus().toggleBold().run())
        }
        className={`tool-btn ${editor.isActive("bold") ? "is-active" : ""}`}
        title="In đậm"
      >
        <b>B</b>
      </button>

      <button
        type="button"
        onMouseDown={(e) =>
          runEditorCommand(e, () => editor.chain().focus().toggleItalic().run())
        }
        className={`tool-btn ${editor.isActive("italic") ? "is-active" : ""}`}
        title="In nghiêng"
      >
        <i>I</i>
      </button>

      <button
        type="button"
        onMouseDown={(e) =>
          runEditorCommand(e, () => editor.chain().focus().toggleStrike().run())
        }
        className={`tool-btn ${editor.isActive("strike") ? "is-active" : ""}`}
        title="Gạch ngang"
      >
        <s>S</s>
      </button>

      <div className="divider"></div>

      <button
        type="button"
        onMouseDown={(e) =>
          runEditorCommand(e, () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
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
        onMouseDown={(e) =>
          runEditorCommand(e, () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
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
        onMouseDown={(e) =>
          runEditorCommand(e, () =>
            editor.chain().focus().toggleBulletList().run(),
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
