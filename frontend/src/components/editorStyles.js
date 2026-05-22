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

/* Collaboration marker - small blue selection, no arrow/name */
.ProseMirror-yjs-selection,
.yjs-selection,
.collaboration-caret__selection,
.collaboration-cursor__selection,
span[class*="yjs"][class*="selection"],
span[class*="collaboration"][class*="selection"] {
  background-color: transparent !important;
  background-image: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 58%,
    rgba(37, 99, 235, 0.22) 58%,
    rgba(37, 99, 235, 0.22) 82%,
    transparent 82%,
    transparent 100%
  ) !important;
  border-radius: 3px !important;
  box-decoration-break: clone !important;
  -webkit-box-decoration-break: clone !important;
}

/* Hide caret arrow/name, keep remote selection highlight only */
.ProseMirror-yjs-cursor,
.yjs-cursor,
.collaboration-caret__caret,
.collaboration-cursor__caret {
  border-left: none !important;
  border-right: none !important;
  background: transparent !important;
  background-color: transparent !important;
  pointer-events: none !important;
}

.ProseMirror-yjs-cursor > *,
.yjs-cursor > *,
.collaboration-caret__label,
.collaboration-cursor__label,
[class*="collaboration-caret"][class*="label"],
[class*="collaboration-cursor"][class*="label"],
[class*="yjs-cursor"] > *,
[class*="ProseMirror-yjs-cursor"] > * {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
  background: transparent !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: transparent !important;
  font-size: 0 !important;
  line-height: 0 !important;
  text-indent: -9999px !important;
}

.ProseMirror-yjs-cursor > *::before,
.ProseMirror-yjs-cursor > *::after,
.yjs-cursor > *::before,
.yjs-cursor > *::after,
.collaboration-caret__label::before,
.collaboration-caret__label::after,
.collaboration-cursor__label::before,
.collaboration-cursor__label::after {
  display: none !important;
  content: none !important;
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

const existingStyle = document.getElementById("editor-styles");

if (existingStyle) {
  existingStyle.innerHTML = editorStyles;
} else {
  const style = document.createElement("style");
  style.id = "editor-styles";
  style.innerHTML = editorStyles;
  document.head.appendChild(style);
}

export default editorStyles;
