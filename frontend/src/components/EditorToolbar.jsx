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

  const isMarkActive = (markName) => {
    const markType = editor.schema.marks[markName];
    if (!markType) return false;

    const { state } = editor;
    const { selection } = state;
    const { empty, $from } = selection;

    if (empty) {
      const marks = state.storedMarks || $from.marks();
      return marks.some((mark) => mark.type === markType);
    }

    return editor.isActive(markName);
  };

  const toggleMarkDirect = (event, markName) => {
    event.preventDefault();
    event.stopPropagation();

    const { state, view } = editor;
    const { schema, selection } = state;
    const markType = schema.marks[markName];

    if (!markType) return;

    const active = isMarkActive(markName);
    let transaction = state.tr;

    if (selection.empty) {
      if (active) {
        transaction = transaction.removeStoredMark(markType);
      } else {
        transaction = transaction.addStoredMark(markType.create());
      }
    } else {
      const { from, to } = selection;

      if (active) {
        transaction = transaction.removeMark(from, to, markType);
      } else {
        transaction = transaction.addMark(from, to, markType.create());
      }
    }

    view.dispatch(transaction);
    view.focus();

    requestAnimationFrame(() => {
      forceUpdate((value) => value + 1);
    });
  };

  const runBlockCommand = (event, callback) => {
    event.preventDefault();
    event.stopPropagation();

    callback();

    requestAnimationFrame(() => {
      forceUpdate((value) => value + 1);
    });
  };

  return (
    <div className="toolbar">
      <ToolbarButton
        title="In đậm"
        active={isMarkActive("bold")}
        onMouseDown={(event) => toggleMarkDirect(event, "bold")}
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title="In nghiêng"
        active={isMarkActive("italic")}
        onMouseDown={(event) => toggleMarkDirect(event, "italic")}
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title="Gạch chân"
        active={isMarkActive("underline")}
        onMouseDown={(event) => toggleMarkDirect(event, "underline")}
      >
        <u>U</u>
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title="Tiêu đề H1"
        active={editor.isActive("heading", { level: 1 })}
        className="text-btn"
        onMouseDown={(event) =>
          runBlockCommand(event, () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          )
        }
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        title="Tiêu đề H2"
        active={editor.isActive("heading", { level: 2 })}
        className="text-btn"
        onMouseDown={(event) =>
          runBlockCommand(event, () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          )
        }
      >
        H2
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title="Danh sách"
        active={editor.isActive("bulletList")}
        className="text-btn"
        onMouseDown={(event) =>
          runBlockCommand(event, () =>
            editor.chain().focus().toggleBulletList().run(),
          )
        }
      >
        • Danh sách
      </ToolbarButton>

      <div className="save-status">{status}</div>
    </div>
  );
};

export default EditorToolbar;
