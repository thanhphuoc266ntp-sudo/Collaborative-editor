import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorComponent from "../components/EditorComponent";
import CurrentDocumentPanel from "../components/editor/CurrentDocumentPanel";
import ProjectFoldersPanel from "../components/editor/ProjectFoldersPanel";
import SharedDocumentsPanel from "../components/editor/SharedDocumentsPanel";
import {
  createDocument,
  deleteDocument,
  enableDocumentLinkSharing,
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

const isValidMongoId = (id) => {
  return /^[a-f\d]{24}$/i.test(String(id || ""));
};

function Editor() {
  const { documentId: documentIdFromUrl } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState("all");
  const [currentDocument, setCurrentDocument] = useState(null);
  const [title, setTitle] = useState("");
  const [shareRole, setShareRole] = useState("viewer");
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [isLoadingCurrentDocument, setIsLoadingCurrentDocument] =
    useState(false);
  const [saveStatus, setSaveStatus] = useState("Đã lưu trên đám mây");

  const hasValidDocumentId = isValidMongoId(documentIdFromUrl);
  const activeDocumentId = hasValidDocumentId ? documentIdFromUrl : null;

  const userName = localStorage.getItem("userName");
  const userEmail =
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "Chưa xác định";

  const displayUser = userName || userEmail;

  const selectedFolder = useMemo(() => {
    return (
      PROJECT_FOLDERS.find((folder) => folder.id === selectedFolderId) ||
      PROJECT_FOLDERS[0]
    );
  }, [selectedFolderId]);

  const filteredDocuments = useMemo(() => {
    if (selectedFolderId === "all") return documents;

    return documents.filter((doc) => {
      const folderId = doc.folderId || "web-project";
      return folderId === selectedFolderId;
    });
  }, [documents, selectedFolderId]);

  const loadDocuments = async () => {
    try {
      setIsLoadingDocuments(true);

      const myDocs = await getMyDocuments();
      const sharedDocs = await getSharedDocuments();

      setDocuments(Array.isArray(myDocs) ? myDocs : []);
      setSharedDocuments(Array.isArray(sharedDocs) ? sharedDocs : []);
    } catch (error) {
      console.error("Lỗi tải danh sách tài liệu:", error);
      setDocuments([]);
      setSharedDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const loadCurrentDocument = async () => {
    if (!documentIdFromUrl) {
      setCurrentDocument(null);
      setTitle("");
      setSaveStatus("Đã lưu trên đám mây");
      return;
    }

    if (!hasValidDocumentId) {
      setCurrentDocument(null);
      setTitle("");
      setSaveStatus("Đã lưu trên đám mây");
      navigate("/editor", { replace: true });
      return;
    }

    try {
      setIsLoadingCurrentDocument(true);

      const doc = await getDocumentById(documentIdFromUrl);

      if (!doc || !isValidMongoId(doc._id || doc.id)) {
        throw new Error("Tài liệu trả về không hợp lệ.");
      }

      setCurrentDocument(doc);
      setTitle(doc.title || "Tài liệu không tên");
      setSaveStatus("Đã lưu trên đám mây");

      if (doc.folderId) {
        setSelectedFolderId(doc.folderId);
      }

      if (doc.shareLink?.role) {
        setShareRole(doc.shareLink.role === "editor" ? "editor" : "viewer");
      }
      await loadDocuments();
    } catch (error) {
      console.error("Lỗi tải tài liệu hiện tại:", error);
      setCurrentDocument(null);
      setTitle("");
      setSaveStatus("Lỗi tải tài liệu");
      alert("Không tìm thấy tài liệu hoặc bạn không có quyền truy cập.");
      navigate("/editor", { replace: true });
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

      const newDocumentId = newDocument?._id || newDocument?.id;

      if (!isValidMongoId(newDocumentId)) {
        throw new Error("Backend không trả về _id hợp lệ khi tạo tài liệu.");
      }

      await loadDocuments();

      navigate(`/editor/${newDocumentId}`);
    } catch (error) {
      console.error("Lỗi tạo tài liệu:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Không thể tạo tài liệu mới. Vui lòng kiểm tra backend hoặc database.",
      );
    }
  };

  const handleOpenDocument = (documentId) => {
    if (!isValidMongoId(documentId)) {
      alert("Mã tài liệu không hợp lệ.");
      return;
    }

    navigate(`/editor/${documentId}`);
  };

  const handleDeleteDocument = async (event, documentId) => {
    event.stopPropagation();

    if (!isValidMongoId(documentId)) {
      alert("Mã tài liệu không hợp lệ.");
      return;
    }

    const ok = window.confirm("Bạn có chắc muốn xóa tài liệu này không?");

    if (!ok) return;

    try {
      await deleteDocument(documentId);
      await loadDocuments();

      if (activeDocumentId === documentId) {
        navigate("/editor", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi xóa tài liệu:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Không thể xóa tài liệu.",
      );
    }
  };

  const handleChangeDocumentFolder = async (event, documentId) => {
    event.stopPropagation();

    if (!isValidMongoId(documentId)) {
      alert("Mã tài liệu không hợp lệ.");
      return;
    }

    const newFolderId = event.target.value;

    try {
      await updateDocumentFolder(documentId, newFolderId);
      await loadDocuments();

      if (activeDocumentId === documentId) {
        setCurrentDocument((prev) => ({
          ...prev,
          folderId: newFolderId,
        }));

        setSelectedFolderId(newFolderId);
      }
    } catch (error) {
      console.error("Lỗi cập nhật thư mục:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Không thể chuyển thư mục cho tài liệu.",
      );
    }
  };

  const handleTitleBlur = async () => {
    if (!activeDocumentId) return;

    const nextTitle = title.trim() || "Tài liệu không tên";

    if (nextTitle === currentDocument?.title) return;

    try {
      setSaveStatus("Đang lưu tên tài liệu...");

      const updatedDocument = await updateDocumentTitle(
        activeDocumentId,
        nextTitle,
      );

      setCurrentDocument(updatedDocument);
      setTitle(updatedDocument.title || nextTitle);
      await loadDocuments();

      setSaveStatus("Đã lưu trên đám mây");
    } catch (error) {
      console.error("Lỗi đổi tên tài liệu:", error);
      setSaveStatus("Lỗi lưu tên tài liệu");
      alert(
        error.response?.data?.message ||
          error.message ||
          "Không thể đổi tên tài liệu.",
      );
    }
  };

  const handleShareDocument = async () => {
    if (!activeDocumentId) {
      alert("Bạn cần mở hoặc tạo tài liệu trước khi chia sẻ.");
      return;
    }

    try {
      await enableDocumentLinkSharing(activeDocumentId, shareRole);

      const link = `${window.location.origin}/editor/${activeDocumentId}`;

      try {
        await navigator.clipboard.writeText(link);
        alert(
          `Đã bật chia sẻ bằng link với quyền ${shareRole}. Link đã được copy.`,
        );
      } catch (copyError) {
        console.error("Không thể copy link tự động:", copyError);
        window.prompt("Copy link chia sẻ:", link);
      }
    } catch (error) {
      console.error("Lỗi bật chia sẻ bằng link:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Không thể bật chia sẻ bằng link. Kiểm tra backend đã deploy route /link-sharing chưa.",
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("user");
    localStorage.removeItem("redirectAfterLogin");

    navigate("/login", { replace: true });
  };

  const scrollToSharedDocuments = () => {
    const section = document.querySelector(".shared-documents-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
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
                !activeDocumentId
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
              onClick={scrollToSharedDocuments}
            >
              <span>👥</span>
              <span>Đã chia sẻ với tôi</span>
            </button>
          </div>

          <ProjectFoldersPanel
            folders={PROJECT_FOLDERS}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
          />

          <CurrentDocumentPanel
            documents={filteredDocuments}
            selectedFolder={selectedFolder}
            documentIdFromUrl={activeDocumentId}
            isLoadingDocuments={isLoadingDocuments}
            onOpenDocument={handleOpenDocument}
            onDeleteDocument={handleDeleteDocument}
            onChangeDocumentFolder={handleChangeDocumentFolder}
          />

          <SharedDocumentsPanel
            sharedDocuments={sharedDocuments}
            documentIdFromUrl={activeDocumentId}
            onOpenDocument={handleOpenDocument}
          />
        </aside>

        <main className="editor-main">
          <header className="editor-topbar">
            <div className="document-title-area">
              {activeDocumentId ? (
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
              <div className="share-control">
                <select
                  className="share-role-select"
                  value={shareRole}
                  onChange={(event) => setShareRole(event.target.value)}
                  disabled={!activeDocumentId}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                </select>

                <button className="share-button" onClick={handleShareDocument}>
                  + Chia sẻ
                </button>
              </div>

              <div className="user-badge">
                <div className="user-avatar">
                  {displayUser.charAt(0).toUpperCase()}
                </div>
                <span>{displayUser}</span>
              </div>

              <button className="logout-button" onClick={handleLogout}>
                Rời khỏi
              </button>
            </div>
          </header>

          <section className="editor-content">
            {!activeDocumentId ? (
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
              <EditorComponent documentId={activeDocumentId} />
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default Editor;
