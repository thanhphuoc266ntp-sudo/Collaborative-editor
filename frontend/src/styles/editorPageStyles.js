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
  flex-shrink: 0;
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
  height: 46px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 26px;
  font-size: 15px;
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
  padding-bottom: 30px;
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

.folder-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.folder-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.folder-card span {
  font-size: 20px;
}

.folder-card strong {
  display: block;
  color: #111827;
  font-size: 14px;
  margin-bottom: 4px;
}

.folder-card small {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

.active-folder {
  border-color: #6366f1;
  background: #eef2ff;
}

.folder-note {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px;
}

.editor-main {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
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
  flex-shrink: 0;
}

.document-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.document-title-input {
  border: none;
  outline: none;
  font-size: 21px;
  font-weight: 700;
  color: #111827;
  background: transparent;
  min-width: 320px;
  max-width: 520px;
  padding: 3px 4px;
  border-radius: 6px;
}

.document-title-input:hover {
  background: #f9fafb;
}

.document-title-input:focus {
  background: #f9fafb;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.document-title-input:disabled {
  color: #9ca3af;
  cursor: default;
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
  flex-shrink: 0;
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
  max-width: 230px;
}

.user-pill span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  flex-shrink: 0;
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
  min-height: 0;
}

.editor-loading {
  padding: 40px;
  color: #374151;
  font-weight: 600;
}

.empty-editor-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #374151;
  background: #f3f4f6;
}

.empty-editor-state h2 {
  font-size: 26px;
  margin-bottom: 8px;
}

.empty-editor-state p {
  color: #6b7280;
  margin-bottom: 20px;
  max-width: 420px;
  line-height: 1.5;
}

.empty-editor-state button {
  border: none;
  background: #4f46e5;
  color: #ffffff;
  padding: 12px 22px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.empty-editor-state button:hover {
  background: #4338ca;
}

@media (max-width: 900px) {
  .sidebar {
    width: 230px;
    padding: 18px 12px;
  }

  .editor-header {
    padding: 0 16px;
  }

  .document-title-input {
    min-width: 180px;
    max-width: 280px;
    font-size: 18px;
  }

  .user-pill {
    max-width: 150px;
  }

  .share-btn {
    padding: 0 12px;
  }
}

@media (max-width: 700px) {
  .editor-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    max-height: 220px;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .editor-header {
    height: auto;
    min-height: 72px;
    gap: 12px;
    flex-wrap: wrap;
    padding: 12px 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .editor-main {
    height: calc(100vh - 220px);
  }
}
`;

if (!document.getElementById("editor-page-styles")) {
  const style = document.createElement("style");
  style.id = "editor-page-styles";
  style.innerHTML = editorPageStyles;
  document.head.appendChild(style);
}

export default editorPageStyles;
