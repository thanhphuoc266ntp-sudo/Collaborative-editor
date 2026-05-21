import React from "react";

function DocumentListItem({
  document,
  active,
  type = "owner",
  folders = [],
  onOpen,
  onDelete,
  onChangeFolder,
}) {
  const title = document?.title || "Tài liệu không tên";

  const documentId = document?._id || document?.id;

  const updatedAt = document?.updatedAt
    ? new Date(document.updatedAt).toLocaleDateString("vi-VN")
    : "Chưa cập nhật";

  const ownerName =
    document?.owner?.email ||
    document?.owner?.name ||
    document?.owner?.username ||
    document?.owner?.displayName ||
    "Không rõ";

  const selectableFolders = Array.isArray(folders)
    ? folders.filter((folder) => folder.id !== "all")
    : [];

  return (
    <div
      className={active ? "document-item selected" : "document-item"}
      onClick={onOpen}
    >
      <div className="document-item-main">
        <span className="document-icon">{type === "shared" ? "👥" : "📄"}</span>

        <div className="document-info">
          <strong>{title}</strong>

          {type === "shared" ? (
            <small>Chủ sở hữu: {ownerName}</small>
          ) : (
            <small>{updatedAt}</small>
          )}
        </div>
      </div>

      {type === "owner" && (
        <div className="document-actions">
          <select
            className="document-folder-select"
            value={document?.folderId || "web-project"}
            onClick={(event) => event.stopPropagation()}
            onChange={onChangeFolder}
          >
            {selectableFolders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="delete-document-btn"
            onClick={onDelete}
            title="Xóa tài liệu"
          >
            🗑
          </button>
        </div>
      )}
    </div>
  );
}

export default DocumentListItem;
