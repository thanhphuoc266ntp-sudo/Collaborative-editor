import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorComponent from "../components/EditorComponent";
import {
  createDocument,
  getDocumentById,
  getMyDocuments,
  getSharedDocuments,
  updateDocumentTitle,
} from "../services/api";
import "../styles/editorPageStyles";

const Editor = () => {
  const navigate = useNavigate();
  const { documentId } = useParams();

  const [currentDocumentId, setCurrentDocumentId] = useState(
    documentId || null,
  );
  const [title, setTitle] = useState("Chưa mở tài liệu");
  const [documents, setDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [activeMenu, setActiveMenu] = useState("current");
  const [loading, setLoading] = useState(true);
  const [titleSaving, setTitleSaving] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    localStorage.setItem("lastEditorPath", window.location.pathname);
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    loadDocuments();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const prepareDocument = async () => {
      try {
        setLoading(true);

        if (!documentId) {
          setCurrentDocumentId(null);
          setTitle("Chưa mở tài liệu");
          setLoading(false);
          return;
        }

        setCurrentDocumentId(documentId);

        const response = await getDocumentById(documentId);

        if (response.success && response.document) {
          setTitle(response.document.title || "Tài liệu không tên");
        }
      } catch (error) {
        console.error("Lỗi chuẩn bị tài liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    prepareDocument();
  }, [documentId, token]);

  const loadDocuments = async () => {
    try {
      const myDocsResponse = await getMyDocuments();
      const sharedResponse = await getSharedDocuments();

      if (myDocsResponse.success) {
        setDocuments(myDocsResponse.documents || []);
      }

      if (sharedResponse.success) {
        setSharedDocuments(sharedResponse.documents || []);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách tài liệu:", error);
    }
  };

  const handleCreateDocument = async () => {
    try {
      const response = await createDocument("Tài liệu không tên");

      if (response.success) {
        const newDocument = response.document;
        const newDocumentId = newDocument.documentId;

        setDocuments((prev) => [newDocument, ...prev]);
        setCurrentDocumentId(newDocumentId);
        setTitle(newDocument.title || "Tài liệu không tên");

        navigate(`/editor/${newDocumentId}`);
      }
    } catch (error) {
      console.error("Lỗi tạo tài liệu:", error);
      alert("Không thể tạo tài liệu mới");
    }
  };

  const handleOpenDocument = (docId) => {
    navigate(`/editor/${docId}`);
  };

  const handleShare = async () => {
    if (!currentDocumentId) {
      alert("Bạn cần mở tài liệu trước khi chia sẻ");
      return;
    }

    const shareUrl = `${window.location.origin}/editor/${currentDocumentId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Đã copy link chia sẻ!");
    } catch (error) {
      prompt("Copy link chia sẻ:", shareUrl);
    }
  };

  const handleTitleBlur = async () => {
    if (!currentDocumentId) return;

    try {
      setTitleSaving(true);
      await updateDocumentTitle(currentDocumentId, title);
      await loadDocuments();
    } catch (error) {
      console.error("Lỗi lưu tên tài liệu:", error);
    } finally {
      setTitleSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const renderCurrentDocuments = () => {
    if (documents.length === 0) {
      return (
        <div className="empty-box">
          <div>📄</div>
          <p>Chưa có tài liệu</p>
          <small>Bấm tạo tài liệu mới để bắt đầu.</small>
        </div>
      );
    }

    return documents.map((doc) => (
      <button
        key={doc.documentId}
        className={`doc-list-item ${
          doc.documentId === currentDocumentId ? "selected" : ""
        }`}
        onClick={() => handleOpenDocument(doc.documentId)}
      >
        <span className="doc-title">{doc.title || "Tài liệu không tên"}</span>
        <span className="doc-time">
          {doc.updatedAt
            ? new Date(doc.updatedAt).toLocaleDateString("vi-VN")
            : ""}
        </span>
      </button>
    ));
  };

  const renderProjectFolders = () => {
    return (
      <div className="folder-panel">
        <div className="folder-card active-folder">
          <span>📁</span>
          <div>
            <strong>Tất cả tài liệu</strong>
            <small>{documents.length} tài liệu</small>
          </div>
        </div>

        <div className="folder-card">
          <span>💻</span>
          <div>
            <strong>Đồ án Web</strong>
            <small>Gợi ý nhóm tài liệu theo dự án</small>
          </div>
        </div>

        <div className="folder-card">
          <span>🔐</span>
          <div>
            <strong>Mật mã học</strong>
            <small>Có thể phát triển thêm bằng folderId</small>
          </div>
        </div>

        <div className="folder-note">
          Hiện tại thư mục dự án có thể dùng để phân loại tài liệu theo
          folderId. Nếu cần làm nhanh để nộp, bạn có thể để phần này là hướng
          phát triển.
        </div>
      </div>
    );
  };

  const renderSharedDocuments = () => {
    if (sharedDocuments.length === 0) {
      return (
        <div className="empty-box">
          <div>👥</div>
          <p>Chưa có tài liệu được chia sẻ</p>
        </div>
      );
    }

    return sharedDocuments.map((doc) => (
      <button
        key={doc.documentId}
        className={`doc-list-item ${
          doc.documentId === currentDocumentId ? "selected" : ""
        }`}
        onClick={() => handleOpenDocument(doc.documentId)}
      >
        <span className="doc-title">{doc.title || "Tài liệu không tên"}</span>
        <span className="doc-time">
          Chủ sở hữu: {doc.owner?.name || doc.owner?.email || "Ẩn"}
        </span>
      </button>
    ));
  };

  if (!token) return null;

  return (
    <div className="editor-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">📄</span>
          <span className="brand-title">MyDocs</span>
        </div>

        <button className="new-doc-btn" onClick={handleCreateDocument}>
          + Tạo tài liệu mới
        </button>

        <div className="workspace-title">KHÔNG GIAN LÀM VIỆC</div>

        <button
          className={`sidebar-item ${activeMenu === "current" ? "active" : ""}`}
          onClick={() => setActiveMenu("current")}
        >
          📄 Tài liệu hiện tại
        </button>

        <button
          className={`sidebar-item ${activeMenu === "folders" ? "active" : ""}`}
          onClick={() => setActiveMenu("folders")}
        >
          📁 Thư mục dự án
        </button>

        <button
          className={`sidebar-item ${activeMenu === "shared" ? "active" : ""}`}
          onClick={() => setActiveMenu("shared")}
        >
          👥 Đã chia sẻ với tôi
        </button>

        <div className="sidebar-list">
          {activeMenu === "current" && renderCurrentDocuments()}
          {activeMenu === "folders" && renderProjectFolders()}
          {activeMenu === "shared" && renderSharedDocuments()}
        </div>
      </aside>

      <main className="editor-main">
        <header className="editor-header">
          <div className="document-info">
            <input
              className="document-title-input"
              value={title}
              disabled={!currentDocumentId}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={handleTitleBlur}
            />

            <div className="cloud-status">
              <span className="green-dot"></span>
              {titleSaving ? "Đang lưu tên..." : "Đã lưu trên đám mây"}
            </div>
          </div>

          <div className="header-actions">
            <button className="share-btn" onClick={handleShare}>
              + Chia sẻ
            </button>

            <div className="user-pill">
              <span className="avatar">
                {user?.name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </span>
              <span>{user?.name || user?.email || "Người dùng"}</span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Rời khỏi
            </button>
          </div>
        </header>

        <section className="editor-content-area">
          {loading ? (
            <div className="editor-loading">Đang tải tài liệu...</div>
          ) : !currentDocumentId ? (
            <div className="empty-editor-state">
              <h2>Chưa mở tài liệu</h2>
              <p>
                Chọn một tài liệu ở thanh bên trái hoặc tạo tài liệu mới để bắt
                đầu.
              </p>
              <button onClick={handleCreateDocument}>+ Tạo tài liệu mới</button>
            </div>
          ) : (
            <EditorComponent documentId={currentDocumentId} />
          )}
        </section>
      </main>
    </div>
  );
};

export default Editor;
