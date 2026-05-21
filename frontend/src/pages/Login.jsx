import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import API from "../services/api";
import { loginStyles as styles } from "../styles/loginStyles";

const LoginContent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const saveLoginData = (data) => {
    const token = data?.token || data?.accessToken || data?.authToken;
    const user = data?.user || data?.data?.user || {};

    if (!token) {
      throw new Error("Backend không trả về token.");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    if (user.email) {
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("email", user.email);
    }

    if (user.name || user.displayName || user.fullName || user.username) {
      localStorage.setItem(
        "userName",
        user.name || user.displayName || user.fullName || user.username,
      );
    }
  };

  const goAfterLogin = () => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");

    localStorage.removeItem("redirectAfterLogin");

    if (
      redirectPath &&
      redirectPath.startsWith("/editor/") &&
      !redirectPath.includes("undefined")
    ) {
      navigate(redirectPath, { replace: true });
      return;
    }

    navigate("/editor", { replace: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) {
      setErrorMsg("");
    }
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

      saveLoginData(response.data);
      goAfterLogin();
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

      const response = await API.post("/auth/google-login", {
        idToken: credentialResponse.credential,
      });

      saveLoginData(response.data);
      goAfterLogin();
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
          <h2 style={styles.title}>MyDocs</h2>
          <p style={styles.subtitle}>Soạn thảo và cộng tác tài liệu realtime</p>
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
              autoComplete="username"
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
              autoComplete="current-password"
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
            {isLoading ? "Đang xác thực..." : "Đăng nhập"}
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
            width="320"
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

const Login = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
};

export default Login;
