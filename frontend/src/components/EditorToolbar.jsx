import React, { useEffect, useRef, useState } from "react";
import { TextSelection } from "@tiptap/pm/state";
import ToolbarButton from "./ToolbarButton";

const DEFAULT_MARKS = {
  bold: false,
  italic: false,
  underline: false,
};

const EditorToolbar = ({
  editor,
  status,
  activeMarksRef,
  buildMarks,
  canEdit = false,
  myRole = "viewer",
}) => {
  const fallbackMarksRef = useRef({
    ...DEFAULT_MARKS,
  });

  const explicitSelectionRef = useRef(null);
  const marksRef = activeMarksRef || fallbackMarksRef;
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      const { state } = editor.view;
      const { selection } = state;

      const domSelection = window.getSelection();
      const selectedTextInDom = domSelection ? domSelection.toString() : "";
      const selectedTextInDoc = selection.empty
        ? ""
        : state.doc.textBetween(selection.from, selection.to, "", "");

      const hasExplicitSelection =
        !selection.empty &&
        selectedTextInDoc.trim().length > 0 &&
        selectedTextInDom.trim().length > 0;

      explicitSelectionRef.current = hasExplicitSelection
        ? {
            from: selection.from,
            to: selection.to,
            text: selectedTextInDoc,
            time: Date.now(),
          }
        : null;

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

  useEffect(() => {
    if (canEdit) return;

    marksRef.current = {
      ...DEFAULT_MARKS,
    };

    explicitSelectionRef.current = null;
    forceUpdate((value) => value + 1);
  }, [canEdit, marksRef]);

  if (!editor) return null;

  const roleLabel =
    myRole === "owner"
      ? "Chủ sở hữu"
      : myRole === "editor"
        ? "Editor"
        : "Viewer";

  const getCurrentMarks = () => {
    return marksRef.current || DEFAULT_MARKS;
  };

  const setCurrentMarks = (nextMarks) => {
    marksRef.current = {
      ...DEFAULT_MARKS,
      ...nextMarks,
    };
  };

  const getBuiltMarks = (schema) => {
    if (typeof buildMarks === "function") {
      return buildMarks(schema);
    }

    const marks = [];
    const currentMarks = getCurrentMarks();

    if (currentMarks.bold && schema.marks.bold) {
      marks.push(schema.marks.bold.create());
    }

    if (currentMarks.italic && schema.marks.italic) {
      marks.push(schema.marks.italic.create());
    }

    if (currentMarks.underline && schema.marks.underline) {
      marks.push(schema.marks.underline.create());
    }

    return marks;
  };

  const getExplicitSelectionRange = () => {
    const savedSelection = explicitSelectionRef.current;

    if (!savedSelection) return null;

    const isFresh = Date.now() - savedSelection.time < 1500;

    if (!isFresh) return null;

    const { state } = editor.view;
    const { from, to, text } = savedSelection;

    if (from < 0 || to > state.doc.content.size || from >= to) {
      return null;
    }

    const currentText = state.doc.textBetween(from, to, "", "");

    if (currentText !== text) {
      return null;
    }

    return {
      from,
      to,
    };
  };

  const collapseToPosition = (position) => {
    const { view } = editor;
    const { state } = view;

    const safePosition = Math.max(
      0,
      Math.min(position, state.doc.content.size),
    );

    const transaction = state.tr.setSelection(
      TextSelection.create(state.doc, safePosition),
    );

    view.dispatch(transaction);
    view.focus();
  };

  const applyStoredMarksOnly = () => {
    if (!canEdit) return;

    const { view } = editor;
    const { state } = view;
    const marks = getBuiltMarks(state.schema);

    view.dispatch(state.tr.setStoredMarks(marks));
    view.focus();
  };

  const insertFormatBoundary = (marks) => {
    if (!canEdit) return;

    const { view } = editor;
    const { state } = view;
    const { schema } = state;
    const { selection } = state;

    const position = selection.to;
    const boundary = schema.text("\u200B", []);

    let transaction = state.tr
      .setSelection(TextSelection.create(state.doc, position))
      .replaceSelectionWith(boundary, false);

    const nextPosition = transaction.selection.to;

    transaction = transaction
      .setSelection(TextSelection.create(transaction.doc, nextPosition))
      .setStoredMarks(marks);

    view.dispatch(transaction);
    view.focus();
  };

  const formatExplicitSelection = (range, markName, nextActive, marks) => {
    const { view } = editor;
    const { state } = view;
    const markType = state.schema.marks[markName];

    if (!markType) return false;

    let transaction = state.tr;

    if (nextActive) {
      transaction = transaction.addMark(
        range.from,
        range.to,
        markType.create(),
      );
    } else {
      transaction = transaction.removeMark(range.from, range.to, markType);
    }

    transaction = transaction
      .setSelection(TextSelection.create(transaction.doc, range.to))
      .setStoredMarks(marks);

    view.dispatch(transaction);
    view.focus();

    explicitSelectionRef.current = null;
    forceUpdate((value) => value + 1);

    return true;
  };

  const toggleTypingMark = (markName) => {
    if (!canEdit) return;

    const { state } = editor.view;
    const { schema } = state;
    const markType = schema.marks[markName];

    if (!markType) return;

    const currentMarks = getCurrentMarks();
    const wasActive = Boolean(currentMarks[markName]);

    setCurrentMarks({
      ...currentMarks,
      [markName]: !wasActive,
    });

    const nextMarks = getCurrentMarks();
    const nextActive = Boolean(nextMarks[markName]);
    const marks = getBuiltMarks(schema);
    const explicitRange = getExplicitSelectionRange();

    if (explicitRange) {
      const didFormatSelection = formatExplicitSelection(
        explicitRange,
        markName,
        nextActive,
        marks,
      );

      if (didFormatSelection) return;
    }

    const currentState = editor.view.state;
    const cursorPosition = currentState.selection.to;

    collapseToPosition(cursorPosition);

    if (wasActive && !nextActive) {
      insertFormatBoundary(marks);
    } else {
      const nextState = editor.view.state;
      editor.view.dispatch(nextState.tr.setStoredMarks(marks));
      editor.view.focus();
    }

    forceUpdate((value) => value + 1);
  };

  const runBlockCommand = (callback) => {
    if (!canEdit) return;

    callback();

    requestAnimationFrame(() => {
      editor.view.focus();
      applyStoredMarksOnly();
      forceUpdate((value) => value + 1);
    });
  };

  const isMarkActive = (markName) => {
    if (!canEdit) return false;

    return Boolean(getCurrentMarks()[markName]);
  };

  return (
    <div className={canEdit ? "toolbar" : "toolbar readonly-toolbar"}>
      <ToolbarButton
        title={canEdit ? "In đậm" : "Viewer không có quyền chỉnh sửa"}
        active={isMarkActive("bold")}
        disabled={!canEdit}
        onRun={() => toggleTypingMark("bold")}
      >
        <b>B</b>
      </ToolbarButton>

      <ToolbarButton
        title={canEdit ? "In nghiêng" : "Viewer không có quyền chỉnh sửa"}
        active={isMarkActive("italic")}
        disabled={!canEdit}
        onRun={() => toggleTypingMark("italic")}
      >
        <i>I</i>
      </ToolbarButton>

      <ToolbarButton
        title={canEdit ? "Gạch chân" : "Viewer không có quyền chỉnh sửa"}
        active={isMarkActive("underline")}
        disabled={!canEdit}
        onRun={() => toggleTypingMark("underline")}
      >
        <u>U</u>
      </ToolbarButton>

      <div className="divider"></div>

      <ToolbarButton
        title={canEdit ? "Tiêu đề H1" : "Viewer không có quyền chỉnh sửa"}
        active={canEdit && editor.isActive("heading", { level: 1 })}
        className="text-btn"
        disabled={!canEdit}
        onRun={() =>
          runBlockCommand(() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
          )
        }
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        title={canEdit ? "Tiêu đề H2" : "Viewer không có quyền chỉnh sửa"}
        active={canEdit && editor.isActive("heading", { level: 2 })}
        className="text-btn"
        disabled={!canEdit}
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
        title={canEdit ? "Danh sách" : "Viewer không có quyền chỉnh sửa"}
        active={canEdit && editor.isActive("bulletList")}
        className="text-btn"
        disabled={!canEdit}
        onRun={() =>
          runBlockCommand(() => editor.chain().focus().toggleBulletList().run())
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
