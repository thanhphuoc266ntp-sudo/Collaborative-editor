/**
 * ToolbarButton.jsx
 *
 * ROOT CAUSE FIXES:
 *
 * 1. Dùng onMouseDown thay vì onClick — xem giải thích chi tiết trong EditorToolbar.jsx.
 *
 * 2. KHÔNG dùng <button type="submit"> hoặc trong <form> — tránh form submission phá state.
 *
 * 3. tabIndex="-1" để toolbar buttons không thể được focus bằng Tab key,
 *    tránh focus accidentally rời khỏi editor.
 *
 * 4. aria-pressed phản ánh đúng trạng thái active để hỗ trợ accessibility.
 *
 * 5. disabled state ngăn tương tác khi editor không ready.
 */

import React from "react";

export default function ToolbarButton({
  children,
  label,
  title,
  active = false,
  disabled = false,
  onAction,
  // Styling hints cho typography variants
  bold = false,
  italic = false,
  underline = false,
  strikethrough = false,
}) {
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "28px",
    height: "28px",
    padding: "0 5px",
    border: "none",
    borderRadius: "5px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "13px",
    lineHeight: 1,
    fontFamily: "inherit",
    transition: "background 0.1s, color 0.1s, box-shadow 0.1s",
    outline: "none",
    position: "relative",
    userSelect: "none",
    WebkitUserSelect: "none",

    // Active state
    background: active ? "rgba(99, 102, 241, 0.15)" : "transparent",
    color: active ? "#4f46e5" : disabled ? "#c0c0c0" : "#374151",

    // Box shadow cho active state
    boxShadow: active ? "inset 0 0 0 1px rgba(99, 102, 241, 0.3)" : "none",

    // Font style hints
    fontWeight: bold ? "700" : "500",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline
      ? "underline"
      : strikethrough
        ? "line-through"
        : "none",
  };

  const handleMouseDown = (e) => {
    /**
     * TUYỆT ĐỐI KHÔNG BỎ DÒNG NÀY.
     *
     * preventDefault() trên mousedown ngăn trình duyệt chuyển focus từ editor
     * sang button. Nếu không có dòng này:
     *
     * 1. User click button Bold
     * 2. mousedown fires → browser bắt đầu chuyển focus
     * 3. editor.blur() fires → ProseMirror xóa stored marks và selection
     * 4. onMouseDown handler chạy → gọi toggleBold()
     * 5. Nhưng selection đã mất → toggleBold() không biết toggle gì → noop
     * 6. Editor không có gì thay đổi → user nghĩ button bị broken
     *
     * Với preventDefault():
     * 1. User click button Bold
     * 2. mousedown fires → preventDefault() ngăn focus chuyển
     * 3. Editor vẫn giữ focus và selection
     * 4. onMouseDown handler chạy → toggleBold()
     * 5. Selection vẫn còn → toggleBold() hoạt động đúng
     * 6. .focus() trong chain đảm bảo editor có focus cho bước tiếp theo
     */
    e.preventDefault();

    if (disabled) return;
    onAction?.(e);
  };

  return (
    <button
      type="button"
      title={title ?? label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      style={baseStyle}
      /**
       * tabIndex="-1": button không nhận focus qua Tab.
       * Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) vẫn hoạt động vì
       * chúng được xử lý bởi ProseMirror keymap, không phải button này.
       */
      tabIndex={-1}
      onMouseDown={handleMouseDown}
      /**
       * onMouseEnter/Leave để hover effect.
       * Dùng inline style vì không muốn phụ thuộc vào CSS modules/globals.
       */
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = active
            ? "rgba(99, 102, 241, 0.2)"
            : "rgba(0, 0, 0, 0.06)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = active
          ? "rgba(99, 102, 241, 0.15)"
          : "transparent";
      }}
    >
      {children ?? label}
    </button>
  );
}
