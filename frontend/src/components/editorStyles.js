const editorStyles = `
.editor-shell {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.toolbar {
  min-height: 52px;
  padding: 8px 14px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 30;
  user-select: none;
}

.tool-btn {
  min-width: 36px;
  height: 34px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tool-btn:hover {
  background: #f3f4f6;
}

.tool-btn.is-active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.text-btn {
  min-width: 44px;
  padding-left: 10px;
  padding-right: 10px;
}

.divider {
  width: 1px;
  height: 28px;
  background: #e5e7eb;
  margin-left: 4px;
  margin-right: 4px;
}

.save-status {
  margin-left: auto;
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.editor-scroll {
  flex: 1;
  overflow: auto;
  padding: 32px 16px;
}

.a4-page {
  width: 794px;
  min-height: 1123px;
  margin: 0 auto;
  padding: 72px 80px;
  background: #ffffff;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.14);
  border-radius: 2px;
  cursor: text;
}

.tiptap-editor-content {
  min-height: 980px;
  outline: none;
  font-size: 16px;
  line-height: 1.7;
  color: #111827;
}

.ProseMirror {
  min-height: 980px;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.ProseMirror p {
  margin: 0 0 12px;
}

.ProseMirror h1 {
  font-size: 32px;
  line-height: 1.25;
  margin: 20px 0 14px;
  font-weight: 700;
}

.ProseMirror h2 {
  font-size: 24px;
  line-height: 1.3;
  margin: 18px 0 12px;
  font-weight: 700;
}

.ProseMirror ul {
  padding-left: 28px;
  margin: 8px 0 12px;
}

.ProseMirror li {
  margin: 4px 0;
}

.editor-loading {
  padding: 24px;
  color: #374151;
}

.viewer-readonly-banner {
  padding: 10px 16px;
  background: #eff6ff;
  color: #1d4ed8;
  border-bottom: 1px solid #bfdbfe;
  font-size: 14px;
  font-weight: 600;
}

.conflict-notice {
  margin: 10px 16px 0;
  padding: 10px 14px;
  border-radius: 12px;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  font-size: 14px;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

/* Collaboration caret / cursor - clean version */
.collaboration-caret__caret,
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 2px solid;
  border-right: none;
  word-break: normal;
  pointer-events: none;
}

.collaboration-caret__caret::before,
.collaboration-cursor__caret::before {
  content: "";
  position: absolute;
  top: -7px;
  left: -5px;
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: currentColor;
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.95),
    0 4px 10px rgba(15, 23, 42, 0.18);
}

.collaboration-caret__label,
.collaboration-cursor__label {
  display: none;
}

@media (max-width: 900px) {
  .editor-scroll {
    padding: 18px 10px;
  }

  .a4-page {
    width: 100%;
    min-height: calc(100vh - 160px);
    padding: 42px 28px;
    border-radius: 10px;
  }

  .tiptap-editor-content,
  .ProseMirror {
    min-height: calc(100vh - 260px);
  }
}
`;

if (!document.getElementById("editor-styles")) {
  const style = document.createElement("style");
  style.id = "editor-styles";
  style.innerHTML = editorStyles;
  document.head.appendChild(style);
}

export default editorStyles;
