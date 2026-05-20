const editorPageStyles = `
.editor-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #f3f4f6;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 18px;
  box-sizing: border-box;
  overflow-y: auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 24px;
  color: #111827;
  margin-bottom: 28px;
}

.brand-icon {
  font-size: 26px;
}

.brand-title {
  letter-spacing: 0.3px;
}

.new-doc-btn {
  width: 100%;
  border: none;
  background: #4f46e5;
  color: #ffffff;
  height: 42px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 26px;
}

.new-doc-btn:hover {
  background: #4338ca;
}

.workspace-title {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.sidebar-item {
  width: 100%;
  border: none;
  background: transparent;
  color: #374151;
  height: 46px;
  border-radius: 8px;
  text-align: left;
  padding: 0 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 6px;
}

.sidebar-item:hover {
  background: #f3f4f6;
}

.sidebar-item.active {
  background: #e0e7ff;
  color: #3730a3;
}

.sidebar-list {
  margin-top: 18px;
}

.doc-list-item {
  width: 100%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.doc-list-item:hover {
  background: #f9fafb;
}

.doc-list-item.selected {
  border-color: #6366f1;
  background: #eef2ff;
}

.doc-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-time {
  font-size: 12px;
  color: #6b7280;
}

.empty-box {
  text-align: center;
  color: #6b7280;
  padding: 24px 8px;
  font-size: 14px;
}

.empty-box p {
  margin: 8px 0 4px;
  font-weight: 600;
}

.empty-box small {
  color: #9ca3af;
}

.editor-main {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  height: 72px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  box-sizing: border-box;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.document-title-input {
  border: none;
  outline: none;
  font-size: 21px;
  font-weight: 700;
  color: #111827;
  background: transparent;
  min-width: 320px;
}

.document-title-input:hover {
  background: #f9fafb;
}

.cloud-status {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.green-dot {
  width: 9px;
  height: 9px;
  background: #10b981;
  border-radius: 999px;
  display: inline-block;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.share-btn {
  border: none;
  background: #e0e7ff;
  color: #4338ca;
  height: 38px;
  padding: 0 18px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.share-btn:hover {
  background: #c7d2fe;
}

.user-pill {
  height: 42px;
  border: 1px solid #e5e7eb;
  padding: 0 14px 0 6px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #111827;
  font-weight: 500;
}

.avatar {
  width: 32px;
  height: 32px;
  background: #7c3aed;
  color: #ffffff;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.logout-btn {
  height: 38px;
  padding: 0 16px;
  border: 1px solid #fecaca;
  background: #ffffff;
  color: #ef4444;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.logout-btn:hover {
  background: #fef2f2;
}

.editor-content-area {
  flex: 1;
  overflow: hidden;
}

.editor-loading {
  padding: 40px;
  color: #374151;
  font-weight: 600;
}
`;

if (!document.getElementById("editor-page-styles")) {
  const style = document.createElement("style");
  style.id = "editor-page-styles";
  style.innerHTML = editorPageStyles;
  document.head.appendChild(style);
}

export default editorPageStyles;
