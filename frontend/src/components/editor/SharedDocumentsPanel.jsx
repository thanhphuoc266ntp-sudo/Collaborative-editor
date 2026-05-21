import React from "react";
import DocumentListItem from "./DocumentListItem";

function SharedDocumentsPanel({
  sharedDocuments = [],
  documentIdFromUrl,
  onOpenDocument,
}) {
  return (
    <div className="shared-documents-section">
      <div className="document-list-header">
        <span>Đã chia sẻ với tôi</span>
        <small>{sharedDocuments.length} tài liệu</small>
      </div>

      {sharedDocuments.length === 0 ? (
        <div className="document-empty">
          Chưa có tài liệu nào được chia sẻ với bạn.
        </div>
      ) : (
        <div className="document-list">
          {sharedDocuments.map((doc) => {
            const documentId = doc._id || doc.id;

            return (
              <DocumentListItem
                key={documentId}
                document={doc}
                active={documentIdFromUrl === documentId}
                type="shared"
                onOpen={() => onOpenDocument(documentId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SharedDocumentsPanel;
