import React from "react";
import DocumentListItem from "./DocumentListItem";

function CurrentDocumentPanel({
  documents,
  selectedFolder,
  documentIdFromUrl,
  isLoadingDocuments,
  onOpenDocument,
  onDeleteDocument,
  onChangeDocumentFolder,
}) {
  return (
    <div className="document-list-section">
      <div className="document-list-header">
        <span>{selectedFolder.name}</span>
        <small>{documents.length} tài liệu</small>
      </div>

      {isLoadingDocuments ? (
        <div className="document-empty">Đang tải tài liệu...</div>
      ) : documents.length === 0 ? (
        <div className="document-empty">
          Chưa có tài liệu trong thư mục này.
        </div>
      ) : (
        <div className="document-list">
          {documents.map((doc) => (
            <DocumentListItem
              key={doc._id}
              document={doc}
              active={documentIdFromUrl === doc._id}
              type="owner"
              onOpen={() => onOpenDocument(doc._id)}
              onDelete={(event) => onDeleteDocument(event, doc._id)}
              onChangeFolder={(event) => onChangeDocumentFolder(event, doc._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CurrentDocumentPanel;
