import React from "react";

const ToolbarButton = ({ isActive, onClick, label, style }) => {
  return (
    <button
      type="button" // Tránh submit form nếu nằm trong form
      className={`toolbar-btn ${isActive ? "is-active" : ""}`}
      style={style}
      // QUAN TRỌNG NHẤT LÀ ĐÂY:
      // preventDefault ở sự kiện mousedown sẽ ngăn trình duyệt chuyển focus
      // từ thẻ contenteditable (editor) sang nút button.
      // Điều này giữ nguyên `storedMarks` (định dạng chờ gõ) của ProseMirror.
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={onClick}
      title={label}
    >
      {label}
    </button>
  );
};

export default ToolbarButton;
