import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { loginStyles as styles } from "../styles/loginStyles";

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
    const lastEditorPath = localStorage.getItem("lastEditorPath");

    if (redirectPath && redirectPath.startsWith("/editor/")) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
      return;
    }

    if (lastEditorPath && lastEditorPath.startsWith("/editor/")) {
      navigate(lastEditorPath);
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

export default Login;
