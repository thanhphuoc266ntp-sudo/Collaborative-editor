import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getUserId = (user) => {
    return user?._id || user?.id || user?.userId;
  };

  const createDocumentAndOpen = async (user) => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");

    if (redirectPath && redirectPath.startsWith("/editor/")) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
      return;
    }

    const userId = getUserId(user);

    if (!userId) {
      throw new Error("Không tìm thấy userId để tạo tài liệu");
    }

    const createDocRes = await API.post("/documents/create", {
      userId,
      title: "Tài liệu không tên",
    });

    navigate(`/editor/${createDocRes.data.documentId}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await API.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      await createDocumentAndOpen(response.data.user);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Thông tin đăng nhập không chính xác.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setErrorMsg("");

      const res = await API.post("/auth/google-login", {
        idToken: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      await createDocumentAndOpen(res.data.user);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Đăng nhập Google thất bại. Vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Collaborative Editing System</h2>
          <p style={styles.subtitle}>Đăng nhập để tiếp tục công việc của bạn</p>
        </div>

        {errorMsg && <div style={styles.errorBox}>⚠️ {errorMsg}</div>}

        <form onSubmit={handleLogin} style={styles.form} noValidate>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              placeholder="Nhập tài khoản"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Mật khẩu</label>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Quên mật khẩu?
              </Link>
            </div>

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              ...(isLoading ? styles.btnDisabled : {}),
            }}
          >
            {isLoading ? "Đang xác thực..." : "Vào Hệ Thống"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>Hoặc</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.googleWrapper}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMsg("Không thể kết nối với Google")}
            text="signin_with"
            shape="rectangular"
            size="large"
            width="100%"
          />
        </div>

        <div style={styles.footer}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={styles.link}>
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "400px",
    padding: "50px 40px",
    borderRadius: "24px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },
  title: {
    margin: "0 0 10px 0",
    color: "#0866ff",
    fontSize: "28px",
    fontWeight: "800",
  },
  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15px",
  },
  errorBox: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontSize: "14px",
    borderLeft: "4px solid #e11d48",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "600",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#0866ff",
    textDecoration: "none",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    padding: "16px",
    backgroundColor: "#0866ff",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(8, 102, 255, 0.3)",
  },
  btnDisabled: {
    backgroundColor: "#94a3b8",
    cursor: "not-allowed",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "24px 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    padding: "0 12px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },
  googleWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
  },
  link: {
    color: "#0866ff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
