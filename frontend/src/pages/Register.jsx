import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Thêm trường xác nhận mật khẩu
    displayName: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Tự động xóa lỗi khi người dùng bắt đầu gõ lại
    if (errorMsg) setErrorMsg("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, displayName } =
      formData;

    // 1. Kiểm tra rỗng tất cả các trường
    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !displayName.trim()
    ) {
      setErrorMsg("Vui lòng điền đầy đủ tất cả các thông tin!");
      return;
    }

    // 2. Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // 3. Kiểm tra mật khẩu xác nhận có khớp không
    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      // Gọi API đăng ký (không gửi confirmPassword lên server)
      await API.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password: password,
        displayName: displayName.trim(),
      });
      alert("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
      navigate("/login");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại sau!",
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
      alert("Đăng ký & Đăng nhập bằng Google thành công!");
      navigate("/");
    } catch (error) {
      setErrorMsg("Đăng nhập Google thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Tham gia ngay! ✨</h2>
          <p style={styles.subtitle}>Tạo tài khoản để cùng nhau làm việc</p>
        </div>

        {errorMsg && (
          <div style={styles.errorBox}>
            <span style={{ marginRight: "8px" }}>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form} noValidate>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              placeholder="Ví dụ: thanhphuoc"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Địa chỉ Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Ví dụ: hoten123@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Tên hiển thị (Nickname)</label>
            <input
              style={styles.input}
              type="text"
              name="displayName"
              placeholder="Tên bạn muốn mọi người gọi"
              value={formData.displayName}
              onChange={handleChange}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mật khẩu bảo mật</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Tối thiểu 6 ký tự"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Ô Xác nhận mật khẩu mới thêm vào */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Xác nhận mật khẩu</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu ở trên"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              ...(isLoading ? styles.submitBtnDisabled : {}),
            }}
          >
            {isLoading ? "Đang xử lý hồ sơ..." : "Hoàn Tất Đăng Ký"}
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
            text="signup_with"
            shape="rectangular"
            size="large"
            width="100%"
          />
        </div>

        <div style={styles.footer}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={styles.link}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

// Cập nhật thêm CSS
const styles = {
  pageWrapper: {
    width: "100vw",
    minHeight: "100vh",
    margin: 0,
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "420px",
    padding: "48px 40px",
    borderRadius: "24px",
    boxShadow:
      "0 20px 40px -10px rgba(0,0,0,0.15), 0 10px 20px -5px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },
  title: {
    margin: "0 0 12px 0",
    color: "#0866ff",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    margin: "0",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "400",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "14px 16px",
    borderRadius: "12px",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px", // Chỉnh gap nhỏ lại một xíu để form không bị quá dài
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  submitBtn: {
    marginTop: "12px",
    width: "100%",
    padding: "16px",
    backgroundColor: "#0866ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px 0 rgba(8, 102, 255, 0.39)",
    transition: "all 0.2s ease",
  },
  submitBtnDisabled: {
    backgroundColor: "#94a3b8",
    boxShadow: "none",
    cursor: "wait",
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
    marginTop: "32px",
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
  },
  link: {
    color: "#0866ff",
    textDecoration: "none",
    fontWeight: "600",
    marginLeft: "6px",
  },
};

export default Register;
