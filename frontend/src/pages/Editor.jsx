import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EditorComponent from "../components/EditorComponent";
import { editorPageStyles as styles } from "../styles/editorPageStyles";

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
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    if (id) {
      localStorage.setItem("lastEditorPath", `/editor/${id}`);
    }
  }, [navigate, id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

export default Editor;
