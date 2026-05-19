import React from "react";
import ToolbarButton from "./ToolbarButton";

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null; // Render null nếu editor chưa sẵn sàng
  }

  return (
    <div className="editor-toolbar">
      <ToolbarButton
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        label="B"
        style={{ fontWeight: "bold" }}
      />
      <ToolbarButton
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        label="I"
        style={{ fontStyle: "italic" }}
      />
      <ToolbarButton
        isActive={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        label="U"
        style={{ textDecoration: "underline" }}
      />
    </div>
  );
};

export default EditorToolbar;
