const editorPageStyles = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif;
  background: #f5f6fb;
  color: #111827;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.editor-page {
  min-height: 100vh;
  display: flex;
  background: #f5f6fb;
}

.editor-sidebar {
  width: 352px;
  min-width: 352px;
  height: 100vh;
  overflow-y: auto;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 24px 22px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.sidebar-menu-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #ede9fe;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.sidebar-header h1 {
  font-size: 32px;
  line-height: 1;
  margin: 0;
  color: #111827;
  font-weight: 800;
}

.create-document-btn {
  width: 100%;
  height: 58px;
  border: none;
  border-radius: 11px;
  background: #4f46e5;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 30px;
  transition: 0.2s ease;
}

.create-document-btn:hover {
  background: #4338ca;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-section-title {
  margin: 0 0 14px;
  color: #9ca3af;
  letter-spacing: 1.8px;
  font-size: 14px;
  font-weight: 800;
}

.sidebar-nav-item {
  width: 100%;
  height: 56px;
  border: none;
  background: transparent;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 18px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 700;
  text-align: left;
}

.sidebar-nav-item:hover {
  background: #f3f4f6;
}

.sidebar-nav-item.active-folder,
.sidebar-nav-item.active {
  background: #e0e7ff;
  color: #3730a3;
}

.folder-list {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.folder-card {
  width: 100%;
  min-height: 88px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  text-align: left;
  transition: 0.2s ease;
}

.folder-card:hover {
  border-color: #818cf8;
  background: #f8faff;
}

.folder-card.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.folder-card-icon {
  font-size: 24px;
  width: 36px;
  flex-shrink: 0;
}

.folder-card-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.folder-card-content strong {
  font-size: 17px;
  color: #111827;
}

.folder-card-content span {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.document-list-section,
.shared-documents-section {
  margin-top: 28px;
}

.document-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111827;
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 12px;
}

.document-list-header small {
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.document-item {
  min-height: 68px;
  border: 1px solid #e5e7eb;
  border-radius: 11px;
  background: #ffffff;
  padding: 10px 10px 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s ease;
}

.document-item:hover {
  background: #f9fafb;
  border-color: #a5b4fc;
}

.document-item.selected {
  border-color: #4f46e5;
  background: #eef2ff;
}

.document-item-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.document-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.document-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.document-info strong {
  max-width: 130px;
  color: #111827;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-info small {
  color: #6b7280;
  font-size: 12px;
}

.document-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.document-folder-select {
  display: none;
}

.delete-document-btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 9px;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  opacity: 0;
  transition: 0.2s ease;
}

.document-item:hover .delete-document-btn {
  opacity: 1;
}

.delete-document-btn:hover {
  background: #fee2e2;
}

.document-empty {
  padding: 14px;
  border-radius: 11px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

.editor-main {
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.editor-topbar {
  height: 76px;
  min-height: 76px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  gap: 20px;
}

.document-title-area {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.document-title-input {
  width: 360px;
  max-width: 42vw;
  border: none;
  outline: none;
  background: transparent;
  color: #111827;
  font-size: 22px;
  font-weight: 800;
  padding: 4px 0;
}

.document-title-input:focus {
  border-bottom: 2px solid #4f46e5;
}

.document-title-placeholder {
  color: #111827;
  font-size: 22px;
  font-weight: 800;
}

.document-save-status {
  color: #6b7280;
  font-size: 13px;
}

.editor-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.share-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.share-role-select {
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
  padding: 0 10px;
  outline: none;
  cursor: pointer;
}

.share-role-select:hover {
  border-color: #a5b4fc;
}

.share-role-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.share-role-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.share-button {
  height: 40px;
  border: none;
  border-radius: 10px;
  background: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  padding: 0 16px;
  cursor: pointer;
  white-space: nowrap;
}

.share-button:hover {
  background: #4338ca;
}

.user-badge {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0 12px 0 6px;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  max-width: 240px;
}

.user-badge span {
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #3730a3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.logout-button {
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
  padding: 0 14px;
  cursor: pointer;
}

.logout-button:hover {
  background: #f3f4f6;
}

.editor-content {
  flex: 1;
  overflow: auto;
  padding: 32px;
  background: #f5f6fb;
}

.empty-editor-state {
  width: min(680px, 92%);
  min-height: 360px;
  margin: 64px auto;
  border: 1px dashed #c7d2fe;
  border-radius: 20px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  padding: 40px;
}

.empty-editor-icon {
  font-size: 54px;
  margin-bottom: 12px;
}

.empty-editor-state h2 {
  margin: 0 0 10px;
  color: #111827;
  font-size: 28px;
}

.empty-editor-state p {
  margin: 0;
  max-width: 460px;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
}

/* Sidebar collapse sections */
.sidebar-collapse-title {
  width: 100%;
  min-height: 48px;
  border: none;
  background: #ffffff;
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 800;
  text-align: left;
  transition: 0.2s ease;
}

.sidebar-collapse-title:hover {
  background: #f3f4f6;
}

.sidebar-collapse-title.active {
  background: #eef2ff;
  color: #3730a3;
}

.sidebar-collapse-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.sidebar-collapse-icon {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: #e0e7ff;
  color: #3730a3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.sidebar-collapse-arrow {
  color: #6b7280;
  font-size: 14px;
  flex-shrink: 0;
}

.sidebar-collapse-content {
  margin-top: 10px;
  margin-bottom: 16px;
  animation: sidebarSectionFade 0.16s ease;
}

@keyframes sidebarSectionFade {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Folder panel */
.folder-panel {
  margin-top: 8px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fafafa;
}

.folder-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.folder-panel-header > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.folder-panel-header strong {
  color: #111827;
  font-size: 15px;
  font-weight: 800;
}

.folder-panel-header span {
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

.folder-create-toggle {
  height: 34px;
  border: none;
  border-radius: 9px;
  background: #4f46e5;
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  padding: 0 10px;
  cursor: pointer;
  white-space: nowrap;
}

.folder-create-toggle:hover {
  background: #4338ca;
}

.folder-create-box {
  padding: 10px;
  border: 1px solid #e0e7ff;
  border-radius: 12px;
  background: #ffffff;
  margin-bottom: 12px;
}

.folder-create-input {
  width: 100%;
  height: 38px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  outline: none;
  color: #111827;
  font-size: 14px;
  padding: 0 10px;
}

.folder-create-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.folder-create-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.folder-create-confirm,
.folder-create-cancel {
  flex: 1;
  height: 34px;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.folder-create-confirm {
  background: #4f46e5;
  color: #ffffff;
}

.folder-create-confirm:hover {
  background: #4338ca;
}

.folder-create-cancel {
  background: #f3f4f6;
  color: #374151;
}

.folder-create-cancel:hover {
  background: #e5e7eb;
}

.folder-panel .folder-list {
  margin-top: 0;
  gap: 10px;
}

.folder-panel .folder-card {
  min-height: 72px;
  padding: 12px 42px 12px 12px;
  position: relative;
}

.folder-delete-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  width: 26px;
  height: 26px;
  transform: translateY(-50%);
  border-radius: 8px;
  color: #ef4444;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  opacity: 0;
  transition: 0.2s ease;
}

.folder-card:hover .folder-delete-btn {
  opacity: 1;
}

.folder-delete-btn:hover {
  background: #fee2e2;
}

.sidebar-section {
  gap: 10px;
}

.document-list-section,
.shared-documents-section {
  margin-top: 0;
}

.sidebar-collapse-content .document-list-section,
.sidebar-collapse-content .shared-documents-section {
  margin-top: 0;
}

@media (max-width: 980px) {
  .editor-page {
    flex-direction: column;
  }

  .editor-sidebar {
    width: 100%;
    min-width: 0;
    height: auto;
    max-height: 55vh;
  }

  .editor-main {
    height: auto;
    min-height: 100vh;
  }

  .editor-topbar {
    height: auto;
    min-height: 76px;
    flex-direction: column;
    align-items: stretch;
    padding: 18px;
  }

  .editor-header-actions {
    flex-wrap: wrap;
  }

  .share-control {
    width: 100%;
  }

  .share-role-select {
    flex: 1;
  }

  .share-button {
    flex: 1;
  }

  .document-title-input {
    width: 100%;
    max-width: 100%;
  }

  .sidebar-collapse-title {
    min-height: 46px;
    font-size: 15px;
  }

  .folder-panel {
    padding: 10px;
  }

  .folder-panel .folder-card {
    min-height: 66px;
  }

  .folder-delete-btn {
    opacity: 1;
  }
}
`;

export default editorPageStyles;
