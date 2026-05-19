import React, { useEffect, useRef, useState } from "react";

const EditorToolbar = ({ editor, status }) => {
  const [, forceUpdate] = useState(0);
  const lastSelectionRef = useRef(null);

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      const { from, to } = editor.state.selection;
      lastSelectionRef.current = { from, to };
      forceUpdate((value) => value + 1);
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);
    editor.on("update", updateToolbar);

    updateToolbar();

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
      editor.off("update", updateToolbar);
    };
  }, [editor]);

  if (!editor) return null;

  const runCommand = (event, commandName, commandOptions = null) => {
    event.preventDefault();
    event.stopPropagation();

    const selection = lastSelectionRef.current;
    const from = selection?.from ?? editor.state.selection.from;
    const to = selection?.to ?? editor.state.selection.to;

    const chain = editor
      .chain()
      .setTextSelection({ from, to })
      .focus(undefined, { scrollIntoView: false });

    if (commandOptions) {
      chain[commandName](commandOptions).run();
    } else {
      chain[commandName]().run();
    }

    requestAnimationFrame(() => {
      forceUpdate((value) => value + 1);
    });
  };

  const buttons = [
    {
      key: "bold",
      title: "In đậm",
      label: <b>B</b>,
      active: editor.isActive("bold"),
      commandName: "toggleBold",
    },
    {
      key: "italic",
      title: "In nghiêng",
      label: <i>I</i>,
      active: editor.isActive("italic"),
      commandName: "toggleItalic",
    },
    {
      key: "underline",
      title: "Gạch chân",
      label: <u>U</u>,
      active: editor.isActive("underline"),
      commandName: "toggleUnderline",
    },
    {
      key: "h1",
      title: "Tiêu đề H1",
      label: "H1",
      active: editor.isActive("heading", { level: 1 }),
      commandName: "toggleHeading",
      commandOptions: { level: 1 },
      extraClass: "text-btn",
      beforeDivider: true,
    },
    {
      key: "h2",
      title: "Tiêu đề H2",
      label: "H2",
      active: editor.isActive("heading", { level: 2 }),
      commandName: "toggleHeading",
      commandOptions: { level: 2 },
      extraClass: "text-btn",
    },
    {
      key: "bulletList",
      title: "Danh sách",
      label: "• Danh sách",
      active: editor.isActive("bulletList"),
      commandName: "toggleBulletList",
      extraClass: "text-btn",
      beforeDivider: true,
    },
  ];

  return (
    <div className="toolbar">
      {buttons.map((button) => (
        <React.Fragment key={button.key}>
          {button.beforeDivider && <div className="divider"></div>}

          <button
            type="button"
            onMouseDown={(event) =>
              runCommand(event, button.commandName, button.commandOptions)
            }
            className={`tool-btn ${button.extraClass || ""} ${
              button.active ? "is-active" : ""
            }`}
            title={button.title}
          >
            {button.label}
          </button>
        </React.Fragment>
      ))}

      <div className="save-status">{status}</div>
    </div>
  );
};

export default EditorToolbar;
