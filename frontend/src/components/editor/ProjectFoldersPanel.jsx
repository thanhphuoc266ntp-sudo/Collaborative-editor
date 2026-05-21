import React, { useState } from "react";

const DEFAULT_FOLDER_IDS = ["all", "web-project", "crypto", "notes"];

function ProjectFoldersPanel({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = () => {
    const name = newFolderName.trim();

    if (!name) {
      alert("Vui lòng nhập tên thư mục.");
      return;
    }

    if (typeof onCreateFolder === "function") {
      onCreateFolder(name);
    }

    setNewFolderName("");
    setIsCreating(false);
  };

  const handleCancelCreate = () => {
    setNewFolderName("");
    setIsCreating(false);
  };

  const handleDeleteFolder = (event, folder) => {
    event.stopPropagation();

    if (DEFAULT_FOLDER_IDS.includes(folder.id)) {
      alert("Không thể xóa thư mục mặc định.");
      return;
    }

    const ok = window.confirm(
      `Bạn có chắc muốn xóa thư mục "${folder.name}" không?`,
    );

    if (!ok) return;

    if (typeof onDeleteFolder === "function") {
      onDeleteFolder(folder.id);
    }
  };

  return (
    <div className="folder-panel">
      <div className="folder-panel-header">
        <div>
          <strong>Thư mục dự án</strong>
          <span>Phân loại tài liệu theo nhóm</span>
        </div>

        <button
          type="button"
          className="folder-create-toggle"
          onClick={() => setIsCreating(true)}
        >
          + Thư mục
        </button>
      </div>

      {isCreating && (
        <div className="folder-create-box">
          <input
            className="folder-create-input"
            value={newFolderName}
            placeholder="Nhập tên thư mục mới..."
            onChange={(event) => setNewFolderName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCreateFolder();
              }

              if (event.key === "Escape") {
                handleCancelCreate();
              }
            }}
            autoFocus
          />

          <div className="folder-create-actions">
            <button
              type="button"
              className="folder-create-confirm"
              onClick={handleCreateFolder}
            >
              Tạo
            </button>

            <button
              type="button"
              className="folder-create-cancel"
              onClick={handleCancelCreate}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="folder-list">
        {folders.map((folder) => {
          const canDelete = !DEFAULT_FOLDER_IDS.includes(folder.id);

          return (
            <button
              key={folder.id}
              type="button"
              className={
                selectedFolderId === folder.id
                  ? "folder-card selected"
                  : "folder-card"
              }
              onClick={() => onSelectFolder(folder.id)}
            >
              <div className="folder-card-icon">{folder.icon}</div>

              <div className="folder-card-content">
                <strong>{folder.name}</strong>
                <span>{folder.description}</span>
              </div>

              {canDelete && (
                <span
                  className="folder-delete-btn"
                  title="Xóa thư mục"
                  onClick={(event) => handleDeleteFolder(event, folder)}
                >
                  ×
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectFoldersPanel;
