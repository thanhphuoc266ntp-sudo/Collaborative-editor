import React from "react";

function ProjectFoldersPanel({ folders, selectedFolderId, onSelectFolder }) {
  return (
    <div className="folder-list">
      {folders.map((folder) => (
        <button
          key={folder.id}
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
        </button>
      ))}
    </div>
  );
}

export default ProjectFoldersPanel;
