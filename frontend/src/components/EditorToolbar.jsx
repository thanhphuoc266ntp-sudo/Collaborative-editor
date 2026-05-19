/**
 * EditorToolbar.jsx
 *
 * ROOT CAUSE FIXES cho B/I/U không toggle được:
 *
 * 1. PHẢI dùng onMouseDown thay vì onClick.
 *    - onClick fires SAU blur event.
 *    - Khi click button → editor blur → selection mất → toggleBold chạy nhưng
 *      không có selection → không biết toggle hay không → hành vi không ổn định.
 *    - onMouseDown fires TRƯỚC blur. Nếu gọi e.preventDefault() ở đây,
 *      browser sẽ không chuyển focus ra khỏi editor → selection được giữ nguyên.
 *
 * 2. PHẢI gọi e.preventDefault() trong onMouseDown của MỌI button toolbar.
 *    Không gọi = focus bị steal từ editor sang button = selection mất.
 *
 * 3. editor.chain().focus().toggleBold().run()
 *    - .focus() sau khi preventDefault là để đảm bảo editor nhận focus trở lại
 *      trong mọi edge case (double-click, long press, v.v.)
 *    - .run() PHẢI được gọi để execute chain.
 *
 * 4. isActive state phải được đọc trực tiếp từ editor trong mỗi render.
 *    Đăng ký onSelectionUpdate + onTransaction để re-render khi selection thay đổi.
 *    Cách đơn giản nhất: component nhận editor prop, Tiptap tự trigger re-render
 *    của component nếu editor được truyền qua (editor.isActive() đọc từ state hiện tại).
 *
 * 5. Phân biệt rõ: toggleBold, toggleItalic, toggleUnderline là 3 command riêng biệt,
 *    hoàn toàn độc lập với nhau. Bật B rồi bật I là hoàn toàn được.
 */

import React, { useCallback, useEffect, useState } from "react";
import ToolbarButton from "./ToolbarButton";
import {
  toolbarStyle,
  toolbarDividerStyle,
  toolbarGroupStyle,
} from "./editorStyles";

/**
 * Hook để force re-render component khi editor state thay đổi.
 * Cần thiết để nút B/I/U hiển thị đúng trạng thái active.
 */
function useEditorState(editor) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => forceUpdate((n) => n + 1);

    // Re-render khi selection thay đổi (bôi đen text)
    editor.on("selectionUpdate", update);
    // Re-render khi nội dung thay đổi (gõ chữ)
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);
}

export default function EditorToolbar({ editor }) {
  // Đăng ký để re-render khi selection/transaction thay đổi
  useEditorState(editor);

  /**
   * Handler chung cho tất cả format buttons.
   *
   * CRITICAL: e.preventDefault() phải là dòng ĐẦU TIÊN.
   * Nếu không có nó, mousedown sẽ:
   * 1. Blur editor
   * 2. Xóa stored marks
   * 3. Chain chạy nhưng không có selection → không có gì xảy ra
   */
  const handleFormat = useCallback(
    (e, commandFn) => {
      // Ngăn browser chuyển focus từ editor sang button
      e.preventDefault();
      // Ngăn event bubble lên các container có thể có handler khác
      e.stopPropagation();

      if (!editor || editor.isDestroyed) return;

      // Execute command — .focus() đảm bảo editor có focus,
      // đặc biệt quan trọng nếu user click vào area ngoài editor trước
      commandFn();
    },
    [editor],
  );

  // Tạo command functions — stable references không quan trọng ở đây vì
  // chúng được gọi từ event handler, không phải từ useEffect deps
  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleUnderline = () => editor.chain().focus().toggleUnderline().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();

  const toggleHeading1 = () =>
    editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleHeading2 = () =>
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  const toggleHeading3 = () =>
    editor.chain().focus().toggleHeading({ level: 3 }).run();

  const toggleBulletList = () =>
    editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () =>
    editor.chain().focus().toggleBlockquote().run();
  const toggleCode = () => editor.chain().focus().toggleCode().run();
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();

  const setAlignLeft = () =>
    editor.chain().focus().setTextAlignment?.("left").run?.() ??
    editor.chain().focus().unsetAllMarks().run();
  const setAlignCenter = () =>
    editor.chain().focus().setTextAlignment?.("center").run?.();
  const setAlignRight = () =>
    editor.chain().focus().setTextAlignment?.("right").run?.();

  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();

  // Kiểm tra canUndo/canRedo để disable buttons
  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  // Đọc trạng thái active — chạy lại mỗi render (sau forceUpdate từ useEditorState)
  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isUnderline = editor.isActive("underline"); // Underline, KHÔNG phải strike
  const isStrike = editor.isActive("strike");
  const isH1 = editor.isActive("heading", { level: 1 });
  const isH2 = editor.isActive("heading", { level: 2 });
  const isH3 = editor.isActive("heading", { level: 3 });
  const isBulletList = editor.isActive("bulletList");
  const isOrderedList = editor.isActive("orderedList");
  const isBlockquote = editor.isActive("blockquote");
  const isCode = editor.isActive("code");
  const isCodeBlock = editor.isActive("codeBlock");

  return (
    /**
     * CRITICAL: KHÔNG đặt onMouseDown với preventDefault trên toolbar container.
     * Chỉ đặt trên từng button. Nếu đặt trên container thì click vào
     * bất kỳ chỗ nào trong toolbar (kể cả khoảng trống) cũng phá selection.
     */
    <div className="editor-toolbar" style={toolbarStyle}>
      {/* Undo / Redo */}
      <div style={toolbarGroupStyle}>
        <ToolbarButton
          label="Undo"
          title="Undo (Ctrl+Z)"
          active={false}
          disabled={!canUndo}
          onAction={(e) => handleFormat(e, undo)}
        >
          <UndoIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          title="Redo (Ctrl+Y)"
          active={false}
          disabled={!canRedo}
          onAction={(e) => handleFormat(e, redo)}
        >
          <RedoIcon />
        </ToolbarButton>
      </div>

      <div style={toolbarDividerStyle} />

      {/* Headings */}
      <div style={toolbarGroupStyle}>
        <ToolbarButton
          label="H1"
          title="Heading 1"
          active={isH1}
          onAction={(e) => handleFormat(e, toggleHeading1)}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          label="H2"
          title="Heading 2"
          active={isH2}
          onAction={(e) => handleFormat(e, toggleHeading2)}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          label="H3"
          title="Heading 3"
          active={isH3}
          onAction={(e) => handleFormat(e, toggleHeading3)}
        >
          H3
        </ToolbarButton>
      </div>

      <div style={toolbarDividerStyle} />

      {/* Inline formatting: B / I / U / S */}
      <div style={toolbarGroupStyle}>
        {/**
         * Bold button
         * - active={isBold}: hiển thị trạng thái đang bật
         * - onAction gọi handleFormat → e.preventDefault() → toggleBold
         *
         * Nếu có selection: toggle bold cho toàn bộ selection
         * Nếu không có selection (cursor): set stored mark → chữ gõ tiếp theo sẽ bold
         * Tiptap tự xử lý cả 2 case này trong toggleBold().
         */}
        <ToolbarButton
          label="B"
          title="Bold (Ctrl+B)"
          active={isBold}
          bold
          onAction={(e) => handleFormat(e, toggleBold)}
        >
          B
        </ToolbarButton>

        {/**
         * Italic button
         * Hoàn toàn độc lập với Bold. Bật B không ảnh hưởng đến I.
         */}
        <ToolbarButton
          label="I"
          title="Italic (Ctrl+I)"
          active={isItalic}
          italic
          onAction={(e) => handleFormat(e, toggleItalic)}
        >
          I
        </ToolbarButton>

        {/**
         * Underline button — dùng toggleUnderline(), KHÔNG phải toggleStrike().
         * Yêu cầu extension Underline được import trong TiptapEditor.jsx.
         */}
        <ToolbarButton
          label="U"
          title="Underline (Ctrl+U)"
          active={isUnderline}
          underline
          onAction={(e) => handleFormat(e, toggleUnderline)}
        >
          U
        </ToolbarButton>

        <ToolbarButton
          label="S"
          title="Strikethrough"
          active={isStrike}
          strikethrough
          onAction={(e) => handleFormat(e, toggleStrike)}
        >
          S
        </ToolbarButton>
      </div>

      <div style={toolbarDividerStyle} />

      {/* Lists */}
      <div style={toolbarGroupStyle}>
        <ToolbarButton
          label="UL"
          title="Bullet List"
          active={isBulletList}
          onAction={(e) => handleFormat(e, toggleBulletList)}
        >
          <BulletListIcon />
        </ToolbarButton>
        <ToolbarButton
          label="OL"
          title="Numbered List"
          active={isOrderedList}
          onAction={(e) => handleFormat(e, toggleOrderedList)}
        >
          <OrderedListIcon />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          title="Blockquote"
          active={isBlockquote}
          onAction={(e) => handleFormat(e, toggleBlockquote)}
        >
          <BlockquoteIcon />
        </ToolbarButton>
      </div>

      <div style={toolbarDividerStyle} />

      {/* Code */}
      <div style={toolbarGroupStyle}>
        <ToolbarButton
          label="Code"
          title="Inline Code"
          active={isCode}
          onAction={(e) => handleFormat(e, toggleCode)}
        >
          <CodeIcon />
        </ToolbarButton>
        <ToolbarButton
          label="CodeBlock"
          title="Code Block"
          active={isCodeBlock}
          onAction={(e) => handleFormat(e, toggleCodeBlock)}
        >
          <CodeBlockIcon />
        </ToolbarButton>
      </div>
    </div>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function UndoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 14 5-5-5-5" />
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </svg>
  );
}

function BulletListIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="9" x2="21" y1="6" y2="6" />
      <line x1="9" x2="21" y1="12" y2="12" />
      <line x1="9" x2="21" y1="18" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="10" x2="21" y1="6" y2="6" />
      <line x1="10" x2="21" y1="12" y2="12" />
      <line x1="10" x2="21" y1="18" y2="18" />
      <text
        x="2"
        y="8"
        fontSize="7"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        1.
      </text>
      <text
        x="2"
        y="14"
        fontSize="7"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        2.
      </text>
      <text
        x="2"
        y="20"
        fontSize="7"
        fill="currentColor"
        stroke="none"
        fontFamily="serif"
      >
        3.
      </text>
    </svg>
  );
}

function BlockquoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CodeBlockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="m8 10-3 3 3 3" />
      <path d="m16 10 3 3-3 3" />
      <path d="m12 8-2 8" />
    </svg>
  );
}
