/* Tổng quan Layout */
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f3f4f6; /* Màu nền xám giống Google Docs */
  font-family: Arial, sans-serif;
}

.tiptap-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  z-index: 10;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Nút Toolbar */
.toolbar-btn {
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  min-width: 36px;
  transition: all 0.2s ease;
  color: #374151;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
}

.toolbar-btn.is-active {
  background-color: #dbeafe; /* Xanh nhạt khi active */
  color: #1d4ed8;
}

/* Trình bày trang A4 */
.a4-page-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
  display: flex;
  justify-content: center;
}

.a4-page {
  width: 210mm;
  min-height: 297mm;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  padding: 20mm; /* Căn lề chuẩn A4 */
  cursor: text; /* Giúp báo hiệu người dùng có thể click vào bất kỳ đâu trên giấy */
}

/* Quan trọng: Fix lỗi CSS của ProseMirror */
.editor-content,
.ProseMirror {
  min-height: 100%;
  outline: none; /* Bỏ viền xanh khó chịu khi focus */
}

/* Căn chỉnh con trỏ Collaboration (Tùy chọn) */
.collaboration-cursor__caret {
  border-left: 2px solid;
  border-right: 2px solid;
  margin-left: -2px;
  margin-right: -2px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}
.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  left: -2px;
  line-height: normal;
  padding: 2px 6px;
  position: absolute;
  top: -1.5em;
  user-select: none;
  white-space: nowrap;
}