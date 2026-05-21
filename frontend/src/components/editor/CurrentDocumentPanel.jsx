import React from "react";
import DocumentListItem from "./DocumentListItem";

function CurrentDocumentPanel({
  documents = [],
  selectedFolder,
  documentIdFromUrl,
  isLoadingDocuments,
  onOpenDocument,
  onDeleteDocument,
  onChangeDocumentFolder,
}) {
  const folderName = selectedFolder?.name || "Tài liệu của tôi";

  return (
    <div className="document-list-section">
      <div className="document-list-header">
        <span>{folderName}</span>
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
          {documents.map((doc) => {
            const documentId = doc._id || doc.id;

            return (
              <DocumentListItem
                key={documentId}
                document={doc}
                active={documentIdFromUrl === documentId}
                type="owner"
                onOpen={() => onOpenDocument(documentId)}
                onDelete={(event) => onDeleteDocument(event, documentId)}
                onChangeFolder={(event) =>
                  onChangeDocumentFolder(event, documentId)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CurrentDocumentPanel;
