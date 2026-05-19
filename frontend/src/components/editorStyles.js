/**
 * editorStyles.js
 *
 * Style cho toàn bộ editor.
 *
 * CRITICAL RULES cho .a4-page:
 * - KHÔNG có user-select: none → phá selection
 * - KHÔNG có pointer-events: none → phá click
 * - KHÔNG có tabIndex → steal focus
 * - KHÔNG có overflow: hidden → cắt mất cursor ở cuối trang
 * - KHÔNG có onMouseDown preventDefault trên wrapper này
 *
 * Tất cả event handling được delegate cho ProseMirror/EditorContent bên trong.
 */

// ─── Toolbar ──────────────────────────────────────────────────────────────────

export const toolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "6px 12px",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  flexWrap: "wrap",
  position: "sticky",
  top: 0,
  zIndex: 10,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.06)",
  userSelect: "none", // Toolbar container: ok để có userSelect none
  WebkitUserSelect: "none", // vì không cần select text ở đây
};

export const toolbarGroupStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1px",
};

export const toolbarDividerStyle = {
  width: "1px",
  height: "20px",
  background: "#e5e7eb",
  margin: "0 4px",
  flexShrink: 0,
};

// ─── Editor root container ─────────────────────────────────────────────────

export const editorContentStyle = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#f3f4f6",
    fontFamily: '"Georgia", "Times New Roman", serif',
  },

  scroll: {
    flex: 1,
    overflowY: "auto",
    overflowX: "auto",
    padding: "32px 16px",
    // KHÔNG có user-select: none ở đây
  },
};

// ─── A4 Page ──────────────────────────────────────────────────────────────────

/**
 * a4PageStyle: chỉ là visual container.
 *
 * KHÔNG đặt:
 * - user-select: none/text (để browser tự handle selection trong ProseMirror)
 * - pointer-events: none (phá click)
 * - overflow: hidden (cắt mất đường cursor cuối trang)
 * - tabIndex (steal focus)
 * - outline: none trên wrapper (ok vì ProseMirror có outline riêng)
 */
export const a4PageStyle = {
  width: "794px", // A4 width ở 96dpi
  minHeight: "1123px", // A4 height ở 96dpi
  margin: "0 auto",
  background: "#ffffff",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08)",
  borderRadius: "2px",
  padding: "96px 96px", // ~2.54cm margins
  boxSizing: "border-box",
  position: "relative",
  // overflow: 'visible'     // để cursor/selection không bị clip
};

// ─── ProseMirror / Tiptap content CSS (inject as <style> tag) ─────────────────

/**
 * CSS string để inject vào document.
 * Dùng createGlobalStyle (styled-components), css-in-js, hoặc
 * import vào global CSS file.
 *
 * Usage với styled-components:
 *   import { createGlobalStyle } from 'styled-components';
 *   const GlobalEditorStyle = createGlobalStyle`${proseMirrorCSS}`;
 *
 * Usage với vanilla React:
 *   <style dangerouslySetInnerHTML={{ __html: proseMirrorCSS }} />
 *
 * Usage với CSS modules / globals: copy vào file .css global.
 */
export const proseMirrorCSS = `
/* ─── ProseMirror Base ───────────────────────────────────────────────────── */

.tiptap-prose-editor {
  outline: none;
  min-height: 200px;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 16px;
  line-height: 1.8;
  color: #1a1a1a;
  caret-color: #4f46e5;

  /* CRITICAL: user-select phải là text (default) để browser handle selection */
  user-select: text;
  -webkit-user-select: text;
}

/* ─── Typography ─────────────────────────────────────────────────────────── */

.tiptap-prose-editor h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 0.67em 0;
  line-height: 1.3;
  color: #111827;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.3em;
}

.tiptap-prose-editor h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 0.83em 0;
  line-height: 1.35;
  color: #1f2937;
}

.tiptap-prose-editor h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0;
  color: #374151;
}

.tiptap-prose-editor p {
  margin: 0.75em 0;
}

.tiptap-prose-editor p:first-child,
.tiptap-prose-editor h1:first-child,
.tiptap-prose-editor h2:first-child,
.tiptap-prose-editor h3:first-child {
  margin-top: 0;
}

/* ─── Inline Marks ───────────────────────────────────────────────────────── */

.tiptap-prose-editor strong {
  font-weight: 700;
}

.tiptap-prose-editor em {
  font-style: italic;
}

/* Underline — dùng text-decoration, KHÔNG phải border-bottom */
.tiptap-prose-editor u {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.tiptap-prose-editor s {
  text-decoration: line-through;
  color: #9ca3af;
}

.tiptap-prose-editor code {
  font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
  font-size: 0.875em;
  background: #f1f5f9;
  color: #be123c;
  padding: 0.15em 0.4em;
  border-radius: 3px;
  border: 1px solid #e2e8f0;
}

/* ─── Lists ──────────────────────────────────────────────────────────────── */

.tiptap-prose-editor ul,
.tiptap-prose-editor ol {
  padding-left: 1.5em;
  margin: 0.75em 0;
}

.tiptap-prose-editor li {
  margin: 0.25em 0;
}

.tiptap-prose-editor li > p {
  margin: 0;
}

/* ─── Blockquote ─────────────────────────────────────────────────────────── */

.tiptap-prose-editor blockquote {
  border-left: 3px solid #6366f1;
  margin: 1em 0;
  padding: 0.5em 0 0.5em 1.25em;
  color: #6b7280;
  font-style: italic;
  background: #fafafa;
}

/* ─── Code Block ─────────────────────────────────────────────────────────── */

.tiptap-prose-editor pre {
  background: #1e1e2e;
  color: #cdd6f4;
  font-family: "JetBrains Mono", "Fira Code", "Courier New", monospace;
  font-size: 0.875em;
  padding: 1em 1.25em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1em 0;
  line-height: 1.6;
}

.tiptap-prose-editor pre code {
  background: none;
  color: inherit;
  padding: 0;
  border: none;
  font-size: inherit;
}

/* ─── Selection ──────────────────────────────────────────────────────────── */

.tiptap-prose-editor ::selection {
  background: rgba(99, 102, 241, 0.2);
  color: inherit;
}

.tiptap-prose-editor .ProseMirror-selectednode {
  outline: 2px solid #6366f1;
}

/* ─── Placeholder ────────────────────────────────────────────────────────── */

.tiptap-prose-editor p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
  font-style: italic;
}

/* ─── Collaboration Cursor ───────────────────────────────────────────────── */

.collaboration-cursor__caret {
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: 1.4;
  padding: 0.1em 0.4em;
  position: absolute;
  top: -1.5em;
  user-select: none;
  white-space: nowrap;
  pointer-events: none;
}

/* ─── Focus ring cho editor ──────────────────────────────────────────────── */

.a4-page:focus-within {
  /* Không thêm outline vì ProseMirror tự handle */
}

/* ─── Loading states ─────────────────────────────────────────────────────── */

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #9ca3af;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  gap: 8px;
}

.editor-skeleton .toolbar-skeleton {
  height: 41px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

.editor-skeleton .page-skeleton {
  height: 400px;
  margin: 32px auto;
  width: 794px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ─── Responsive ─────────────────────────────────────────────────────────── */

@media (max-width: 860px) {
  .a4-page {
    width: 100% !important;
    padding: 48px 32px !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
`;

// ─── Helper: inject CSS vào document ─────────────────────────────────────────

/**
 * Gọi hàm này một lần trong App.jsx hoặc index.jsx:
 *
 *   import { injectEditorStyles } from './editorStyles';
 *   injectEditorStyles();
 *
 * Hoặc dùng proseMirrorCSS string với createGlobalStyle của styled-components.
 */
export function injectEditorStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("tiptap-editor-styles")) return;

  const style = document.createElement("style");
  style.id = "tiptap-editor-styles";
  style.textContent = proseMirrorCSS;
  document.head.appendChild(style);
}
