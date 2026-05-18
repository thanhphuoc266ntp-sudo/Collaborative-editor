import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditorComponent from "../components/EditorComponent";

const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const userString = localStorage.getItem("user");
  const user = userString
    ? JSON.parse(userString)
    : { displayName: "Người dùng" };

  const displayName =
    user.displayName || user.username || user.email || "Người dùng";

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleShare = () => {
    const link = `${window.location.origin}/editor/${id}`;
    navigator.clipboard.writeText(link);
    alert("Đã copy link chia sẻ!");
  };

  if (!localStorage.getItem("token")) return null;

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarBrand}>
          <span style={{ fontSize: "24px" }}>🌊</span> MyDocs
        </div>

        <div style={styles.menuSection}>
          <div style={styles.menuTitle}>KHÔNG GIAN LÀM VIỆC</div>

          <div style={styles.sidebarItemActive}>
            <span style={styles.icon}>📄</span> Tài liệu hiện tại
          </div>

          <div style={styles.sidebarItem}>
            <span style={styles.icon}>📁</span> Thư mục dự án
          </div>

          <div style={styles.sidebarItem}>
            <span style={styles.icon}>👥</span> Đã chia sẻ với tôi
          </div>
        </div>
      </aside>

      <div style={styles.mainArea}>
        <header style={styles.navbar}>
          <div style={styles.navLeft}>
            <div style={styles.docInfo}>
              <h1 style={styles.docTitle}>Collaborative Editor</h1>

              <div style={styles.docStatus}>
                <span style={styles.statusDot}></span>
                <span style={styles.statusText}>Đã lưu trên đám mây</span>
              </div>
            </div>
          </div>

          <div style={styles.navRight}>
            <button style={styles.shareBtn} onClick={handleShare}>
              + Chia sẻ
            </button>

            <div style={styles.userBadge}>
              <div style={styles.avatar}>
                {displayName.charAt(0).toUpperCase()}
              </div>

              <span style={styles.userName}>{displayName}</span>
            </div>

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Rời khỏi
            </button>
          </div>
        </header>

        <div style={styles.workspace}>
          <div style={styles.editorContainer}>
            <div style={styles.editorPaper}>
              <EditorComponent documentId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #e5e7eb",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    zIndex: 20,
  },
  sidebarBrand: {
    fontSize: "22px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#111827",
    padding: "0 8px",
    marginBottom: "10px",
  },
  menuSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  menuTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: "1px",
    padding: "0 8px",
    marginBottom: "8px",
  },
  sidebarItem: {
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#4b5563",
    fontWeight: "500",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sidebarItemActive: {
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  icon: {
    fontSize: "18px",
  },
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    borderBottom: "1px solid #e5e7eb",
  },
  navLeft: {
    display: "flex",
    alignItems: "center",
  },
  docInfo: {
    display: "flex",
    flexDirection: "column",
  },
  docTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  },
  docStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "4px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
  },
  statusText: {
    fontSize: "12px",
    color: "#6b7280",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  shareBtn: {
    backgroundColor: "#e0e7ff",
    color: "#4f46e5",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 12px 4px 4px",
    borderRadius: "30px",
    border: "1px solid #e5e7eb",
  },
  avatar: {
    width: "28px",
    height: "28px",
    backgroundColor: "#8b5cf6",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  userName: {
    fontSize: "14px",
  },
  logoutBtn: {
    color: "#ef4444",
    border: "1px solid #fca5a5",
    backgroundColor: "#ffffff",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  workspace: {
    flex: 1,
    overflow: "auto",
    backgroundColor: "#f3f4f6",
  },
  editorContainer: {
    width: "100%",
    minHeight: "100%",
  },
  editorPaper: {
    padding: "40px 80px",
  },
};

export default Editor;
