import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorComponent from "../components/EditorComponent";
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getMyDocuments,
  getSharedDocuments,
  updateDocumentFolder,
  updateDocumentTitle,
} from "../services/api";
import editorPageStyles from "../styles/editorPageStyles";

const PROJECT_FOLDERS = [
  {
    id: "all",
    name: "Tất cả tài liệu",
    icon: "📁",
    description: "Xem toàn bộ tài liệu của bạn",
  },
  {
    id: "web-project",
    name: "Đồ án Web",
    icon: "💻",
    description: "Tài liệu liên quan đến đồ án",
  },
  {
    id: "crypto",
    name: "Mật mã học",
    icon: "🔐",
    description: "Bài tập và ghi chú môn học",
  },
  {
    id: "notes",
    name: "Ghi chú",
    icon: "📝",
    description: "Ghi chú cá nhân và ý tưởng",
  },
];

function Editor() {
  const { documentId: documentIdFromUrl } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("all");
  const [currentDocument, setCurrentDocument] = useState(null);
  const [title, setTitle] = useState("");
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingCurrentDocument, setIsLoadingCurrentDocument] =
    useState(false);
  const [saveStatus, setSaveStatus] = useState("Đã lưu trên đám mây");

  const userEmail =
    localStorage.getItem("email") ||
    localStorage.getItem("userEmail") ||
    "user@gmail.com";

  const filteredDocuments = useMemo(() => {
    if (selectedFolderId === "all") return documents;

    return documents.filter((doc) => {
      const folderId = doc.folderId || "web-project";
      return folderId === selectedFolderId;
    });
  }, [documents, selectedFolderId]);

  const selectedFolder = useMemo(() => {
    return (
      PROJECT_FOLDERS.find((folder) => folder.id === selectedFolderId) ||
      PROJECT_FOLDERS[0]
    );
  }, [selectedFolderId]);

  const loadDocuments = async () => {
    try {
      setIsLoadingDocuments(true);

      const myDocs = await getMyDocuments();
      const sharedDocs = await getSharedDocuments();

      setDocuments(Array.isArray(myDocs) ? myDocs : []);
      setSharedDocuments(Array.isArray(sharedDocs) ? sharedDocs : []);
    } catch (error) {
      console.error("Lỗi tải danh sách tài liệu:", error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const loadCurrentDocument = async () => {
    if (!documentIdFromUrl) {
      setCurrentDocument(null);
      setTitle("");
      return;
    }

    try {
      setIsLoadingCurrentDocument(true);

      const doc = await getDocumentById(documentIdFromUrl);

      setCurrentDocument(doc);
      setTitle(doc?.title || "Tài liệu không tên");

      if (doc?.folderId) {
        setSelectedFolderId(doc.folderId);
      }
    } catch (error) {
      console.error("Lỗi tải tài liệu hiện tại:", error);
      setCurrentDocument(null);
      setTitle("");
      alert("Không tìm thấy tài liệu hoặc bạn không có quyền truy cập.");
      navigate("/editor");
    } finally {
      setIsLoadingCurrentDocument(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    loadCurrentDocument();
  }, [documentIdFromUrl]);

  const handleCreateDocument = async () => {
    try {
      const folderId =
        selectedFolderId === "all" ? "web-project" : selectedFolderId;

      const newDocument = await createDocument({
        title: "Tài liệu không tên",
        folderId,
      });

      await loadDocuments();

      navigate(`/editor/${newDocument._id}`);
    } catch (error) {
      console.error("Lỗi tạo tài liệu:", error);
      alert("Không thể tạo tài liệu mới.");
    }
  };

  const handleOpenDocument = (documentId) => {
    navigate(`/editor/${documentId}`);
  };

  const handleDeleteDocument = async (event, documentId) => {
    event.stopPropagation();

    const ok = window.confirm("Bạn có chắc muốn xóa tài liệu này không?");

    if (!ok) return;

    try {
      await deleteDocument(documentId);
      await loadDocuments();

      if (documentIdFromUrl === documentId) {
        navigate("/editor");
      }
    } catch (error) {
      console.error("Lỗi xóa tài liệu:", error);
      alert("Không thể xóa tài liệu.");
    }
  };

  const handleChangeDocumentFolder = async (event, documentId) => {
    event.stopPropagation();

    const newFolderId = event.target.value;

    try {
      await updateDocumentFolder(documentId, newFolderId);
      await loadDocuments();

      if (documentIdFromUrl === documentId) {
        setCurrentDocument((prev) => ({
          ...prev,
          folderId: newFolderId,
        }));
        setSelectedFolderId(newFolderId);
      }
    } catch (error) {
      console.error("Lỗi cập nhật thư mục:", error);
      alert("Không thể chuyển thư mục cho tài liệu.");
    }
  };

  const handleTitleBlur = async () => {
    if (!documentIdFromUrl) return;

    const nextTitle = title.trim() || "Tài liệu không tên";

    if (nextTitle === currentDocument?.title) return;

    try {
      setSaveStatus("Đang lưu tên tài liệu...");

      const updatedDocument = await updateDocumentTitle(
        documentIdFromUrl,
        nextTitle,
      );

      setCurrentDocument(updatedDocument);
      setTitle(updatedDocument.title || nextTitle);
      await loadDocuments();

      setSaveStatus("Đã lưu trên đám mây");
    } catch (error) {
      console.error("Lỗi đổi tên tài liệu:", error);
      setSaveStatus("Lỗi lưu tên tài liệu");
      alert("Không thể đổi tên tài liệu.");
    }
  };

  const handleCopyShareLink = async () => {
    if (!documentIdFromUrl) {
      alert("Bạn cần mở hoặc tạo tài liệu trước khi chia sẻ.");
      return;
    }

    const link = `${window.location.origin}/editor/${documentIdFromUrl}`;

    try {
      await navigator.clipboard.writeText(link);
      alert("Đã copy link chia sẻ.");
    } catch (error) {
      console.error("Lỗi copy link:", error);
      window.prompt("Copy link chia sẻ:", link);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <>
      <style>{editorPageStyles}</style>

      <div className="editor-page">
        <aside className="editor-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-menu-icon">☰</div>
            <h1>MyDocs</h1>
          </div>

          <button
            className="create-document-btn"
            onClick={handleCreateDocument}
          >
            + Tạo tài liệu mới
          </button>

          <div className="sidebar-section">
            <p className="sidebar-section-title">KHÔNG GIAN LÀM VIỆC</p>

            <button
              className={
                !documentIdFromUrl
                  ? "sidebar-nav-item active"
                  : "sidebar-nav-item"
              }
              onClick={() => navigate("/editor")}
            >
              <span>📄</span>
              <span>Tài liệu hiện tại</span>
            </button>

            <button className="sidebar-nav-item active-folder">
              <span>📁</span>
              <span>Thư mục dự án</span>
            </button>

            <button
              className="sidebar-nav-item"
              onClick={() => {
                const section = document.querySelector(
                  ".shared-documents-section",
                );

                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            >
              <span>👥</span>
              <span>Đã chia sẻ với tôi</span>
            </button>
          </div>

          <div className="folder-list">
            {PROJECT_FOLDERS.map((folder) => (
              <button
                key={folder.id}
                className={
                  selectedFolderId === folder.id
                    ? "folder-card selected"
                    : "folder-card"
                }
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <div className="folder-card-icon">{folder.icon}</div>

                <div className="folder-card-content">
                  <strong>{folder.name}</strong>
                  <span>{folder.description}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="document-list-section">
            <div className="document-list-header">
              <span>{selectedFolder.name}</span>
              <small>{filteredDocuments.length} tài liệu</small>
            </div>

            {isLoadingDocuments ? (
              <div className="document-empty">Đang tải tài liệu...</div>
            ) : filteredDocuments.length === 0 ? (
              <div className="document-empty">
                Chưa có tài liệu trong thư mục này.
              </div>
            ) : (
              <div className="document-list">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc._id}
                    className={
                      documentIdFromUrl === doc._id
                        ? "document-item selected"
                        : "document-item"
                    }
                    onClick={() => handleOpenDocument(doc._id)}
                  >
                    <div className="document-item-main">
                      <span className="document-icon">📄</span>

                      <div className="document-info">
                        <strong>{doc.title || "Tài liệu không tên"}</strong>
                        <small>
                          {doc.updatedAt
                            ? new Date(doc.updatedAt).toLocaleDateString(
                                "vi-VN",
                              )
                            : "Chưa cập nhật"}
                        </small>
                      </div>
                    </div>

                    <div className="document-actions">
                      <select
                        className="document-folder-select"
                        value={doc.folderId || "web-project"}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          handleChangeDocumentFolder(event, doc._id)
                        }
                      >
                        {PROJECT_FOLDERS.filter(
                          (folder) => folder.id !== "all",
                        ).map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>

                      <button
                        className="delete-document-btn"
                        onClick={(event) =>
                          handleDeleteDocument(event, doc._id)
                        }
                        title="Xóa tài liệu"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                {sharedDocuments.map((doc) => (
                  <div
                    key={doc._id}
                    className={
                      documentIdFromUrl === doc._id
                        ? "document-item selected"
                        : "document-item"
                    }
                    onClick={() => handleOpenDocument(doc._id)}
                  >
                    <div className="document-item-main">
                      <span className="document-icon">👥</span>

                      <div className="document-info">
                        <strong>{doc.title || "Tài liệu không tên"}</strong>
                        <small>
                          Chủ sở hữu:{" "}
                          {doc.owner?.email || doc.owner?.name || "Không rõ"}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <main className="editor-main">
          <header className="editor-topbar">
            <div className="document-title-area">
              {documentIdFromUrl ? (
                <input
                  className="document-title-input"
                  value={title}
                  disabled={isLoadingCurrentDocument}
                  onChange={(event) => setTitle(event.target.value)}
                  onBlur={handleTitleBlur}
                />
              ) : (
                <div className="document-title-placeholder">
                  Chưa mở tài liệu
                </div>
              )}

              <div className="document-save-status">{saveStatus}</div>
            </div>

            <div className="editor-header-actions">
              <button className="share-button" onClick={handleCopyShareLink}>
                + Chia sẻ
              </button>

              <div className="user-badge">
                <div className="user-avatar">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span>{userEmail}</span>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                Rời khỏi
              </button>
            </div>
          </header>

          <section className="editor-content">
            {!documentIdFromUrl ? (
              <div className="empty-editor-state">
                <div className="empty-editor-icon">📄</div>
                <h2>Chưa mở tài liệu</h2>
                <p>
                  Chọn một tài liệu ở sidebar hoặc bấm “+ Tạo tài liệu mới” để
                  bắt đầu soạn thảo.
                </p>
              </div>
            ) : isLoadingCurrentDocument ? (
              <div className="empty-editor-state">
                <div className="empty-editor-icon">⏳</div>
                <h2>Đang tải tài liệu</h2>
                <p>Vui lòng chờ trong giây lát.</p>
              </div>
            ) : (
              <EditorComponent documentId={documentIdFromUrl} />
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default Editor;
