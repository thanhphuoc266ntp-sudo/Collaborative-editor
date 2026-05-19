import React, { useEffect, useState } from "react";
import { TextSelection } from "@tiptap/pm/state";
import ToolbarButton from "./ToolbarButton";

const EditorToolbar = ({ editor, status, activeMarksRef, buildMarks }) => {
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

  const applyTypingMarks = () => {
    const { view } = editor;
    const { state } = view;
    const marks = buildMarks(state.schema);

    const transaction = state.tr.setStoredMarks(marks);

    view.dispatch(transaction);
    view.focus();
  };

  const insertZeroWidthBoundary = () => {
    const { view } = editor;
    const { state } = view;
    const { schema } = state;

    const boundary = schema.text("\u200B", []);
    const marks = buildMarks(schema);

    let transaction = state.tr.replaceSelectionWith(boundary, false);
    const position = transaction.selection.to;

    transaction = transaction
      .setSelection(TextSelection.create(transaction.doc, position))
      .setStoredMarks(marks);

    view.dispatch(transaction);
    view.focus();
  };

  const toggleTypingMark = (markName) => {
    const { view } = editor;
    const { state } = view;
    const { selection, schema } = state;
    const markType = schema.marks[markName];

    if (!markType) return;

    const wasActive = Boolean(activeMarksRef.current[markName]);

    activeMarksRef.current = {
      ...activeMarksRef.current,
      [markName]: !wasActive,
    };

    const nextActive = Boolean(activeMarksRef.current[markName]);
    const marks = buildMarks(schema);

    view.focus();

    if (!selection.empty) {
      let transaction = state.tr;

      if (nextActive) {
        transaction = transaction.addMark(
          selection.from,
          selection.to,
          markType.create(),
        );
      } else {
        transaction = transaction.removeMark(
          selection.from,
          selection.to,
          markType,
        );
      }

      transaction = transaction.setStoredMarks(marks);

      view.dispatch(transaction);
      view.focus();
    } else {
      view.dispatch(state.tr.setStoredMarks(marks));
      view.focus();

      if (wasActive && !nextActive) {
        insertZeroWidthBoundary();
      }
    }

    forceUpdate((value) => value + 1);

    requestAnimationFrame(() => {
      applyTypingMarks();
      forceUpdate((value) => value + 1);
    });
  };

  const runBlockCommand = (callback) => {
    callback();

    requestAnimationFrame(() => {
      editor.view.focus();
      forceUpdate((value) => value + 1);
    });
  };

  const isMarkActive = (markName) => {
    return Boolean(activeMarksRef.current[markName]);
  };

  return (
    <div className="toolbar">
      <ToolbarButton
        title="In đậm"
        active={isMarkActive("bold")}
        onRun={() => toggleTypingMark("bold")}
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title="In nghiêng"
        active={isMarkActive("italic")}
        onRun={() => toggleTypingMark("italic")}
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title="Gạch chân"
        active={isMarkActive("underline")}
        onRun={() => toggleTypingMark("underline")}
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
