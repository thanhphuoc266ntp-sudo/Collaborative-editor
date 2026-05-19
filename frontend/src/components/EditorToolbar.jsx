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
    const { empty, $from } = state.selection;

    if (empty) {
      const marks = state.storedMarks || $from.marks();
      return marks.some((mark) => mark.type === markType);
    }

    return editor.isActive(markName);
  };

  const toggleTextMark = (event, markName) => {
    event.preventDefault();
    event.stopPropagation();

    const { from, to, empty } = editor.state.selection;
    const active = isMarkActive(markName);

    let chain = editor.chain().focus(undefined, { scrollIntoView: false });

    if (!empty) {
      chain = chain.setTextSelection({ from, to });
    }

    if (active) {
      chain.unsetMark(markName).run();
    } else {
      chain.setMark(markName).run();
    }

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
        onMouseDown={(event) => toggleTextMark(event, "bold")}
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title="In nghiêng"
        active={isMarkActive("italic")}
        onMouseDown={(event) => toggleTextMark(event, "italic")}
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title="Gạch chân"
        active={isMarkActive("underline")}
        onMouseDown={(event) => toggleTextMark(event, "underline")}
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
