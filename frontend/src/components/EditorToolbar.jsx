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

  const getActiveMark = (markName) => {
    const { state } = editor;
    const markType = state.schema.marks[markName];

    if (!markType) return false;

    const { selection } = state;
    const { empty, $from } = selection;

    if (empty) {
      const marks = state.storedMarks || $from.marks();
      return markType.isInSet(marks);
    }

    return editor.isActive(markName);
  };

  const toggleMark = (markName) => {
    const { view } = editor;
    const { state } = view;
    const { schema, selection } = state;
    const markType = schema.marks[markName];

    if (!markType) return;

    const { empty, from, to, $from } = selection;
    const currentMarks = state.storedMarks || $from.marks();
    const isActive = empty
      ? Boolean(markType.isInSet(currentMarks))
      : editor.isActive(markName);

    let transaction = state.tr;

    if (empty) {
      if (isActive) {
        const nextMarks = currentMarks.filter((mark) => mark.type !== markType);
        transaction = transaction.setStoredMarks(nextMarks);
      } else {
        const cleanMarks = currentMarks.filter(
          (mark) => mark.type !== markType,
        );
        transaction = transaction.setStoredMarks([
          ...cleanMarks,
          markType.create(),
        ]);
      }
    } else {
      if (isActive) {
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

  const runBlockCommand = (callback) => {
    callback();

    requestAnimationFrame(() => {
      forceUpdate((value) => value + 1);
    });
  };

  return (
    <div className="toolbar">
      <ToolbarButton
        title="In đậm"
        active={getActiveMark("bold")}
        onRun={() => toggleMark("bold")}
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title="In nghiêng"
        active={getActiveMark("italic")}
        onRun={() => toggleMark("italic")}
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title="Gạch chân"
        active={getActiveMark("underline")}
        onRun={() => toggleMark("underline")}
      >
        <u>U</u>
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title="Tiêu đề H1"
        active={editor.isActive("heading", { level: 1 })}
        className="text-btn"
        onRun={() =>
          runBlockCommand(() =>
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
        onRun={() =>
          runBlockCommand(() =>
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
        onRun={() =>
          runBlockCommand(() => editor.chain().focus().toggleBulletList().run())
        }
      >
        • Danh sách
      </ToolbarButton>

      <div className="save-status">{status}</div>
    </div>
  );
};

export default EditorToolbar;
