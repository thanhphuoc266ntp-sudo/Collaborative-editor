import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (canEdit) return;
    if (!activeMarksRef) return;

    activeMarksRef.current = {
      ...DEFAULT_MARKS,
    };

    forceUpdate((value) => value + 1);
  }, [canEdit, activeMarksRef]);

  if (!editor) return null;

  const roleLabel =
    myRole === "owner"
      ? "Chủ sở hữu"
      : myRole === "editor"
        ? "Editor"
        : "Viewer";

  const getCurrentMarks = () => {
    return activeMarksRef?.current || DEFAULT_MARKS;
  };

  const setCurrentMarks = (nextMarks) => {
    if (!activeMarksRef) return;

    activeMarksRef.current = {
      ...DEFAULT_MARKS,
      ...nextMarks,
    };
  };

  const getBuiltMarks = (schema) => {
    if (typeof buildMarks !== "function") {
      return [];
    }

    return buildMarks(schema);
  };

  const hasRealSelectedText = () => {
    const { state } = editor.view;
    const { selection } = state;

    if (selection.empty) return false;

    const selectedText = state.doc.textBetween(
      selection.from,
      selection.to,
      "",
      "",
    );

    return selectedText.length > 0;
  };

  const applyTypingMarks = () => {
    if (!canEdit) return;

    const { view } = editor;
    const { state } = view;
    const marks = getBuiltMarks(state.schema);

    const transaction = state.tr.setStoredMarks(marks);

    view.dispatch(transaction);
    view.focus();
  };

  const toggleTypingMark = (markName) => {
    if (!canEdit) return;
    if (!activeMarksRef) return;

    const { view } = editor;
    const { state } = view;
    const { selection, schema } = state;
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
    const shouldFormatSelectedText = hasRealSelectedText();

    if (shouldFormatSelectedText) {
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

      forceUpdate((value) => value + 1);
      return;
    }

    const transaction = state.tr.setStoredMarks(marks);

    view.dispatch(transaction);
    view.focus();

    forceUpdate((value) => value + 1);
  };

  const runBlockCommand = (callback) => {
    if (!canEdit) return;

    callback();

    requestAnimationFrame(() => {
      editor.view.focus();
      applyTypingMarks();
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
