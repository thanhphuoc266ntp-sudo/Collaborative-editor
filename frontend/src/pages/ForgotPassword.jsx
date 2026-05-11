import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Dữ liệu form
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Trạng thái thông báo
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm dọn dẹp khi muốn nhập email khác
  const handleTryAnotherEmail = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setMessage("");
    setErrorMsg("");
  };

  // Xử lý gửi Email
  const handleSendEmail = async (e) => {
    e.preventDefault();

    // Kiểm tra rỗng bằng React
    if (!email.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email của bạn!");
      return;
    }

    setErrorMsg("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", {
        email: email.trim(),
      });
      setMessage(res.data.message || "Đã gửi mã OTP!");
      setStep(2);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác nhận OTP & Đổi mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Kiểm tra rỗng bằng React
    if (!otp.trim() || !newPassword.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!");
      return;
    }

    if (otp.length < 6) {
      setErrorMsg("Mã OTP phải có đủ 6 chữ số!");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        email: email.trim(),
        otp,
        newPassword,
      });
      setMessage(res.data.message || "Đổi mật khẩu thành công!");
      setErrorMsg("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Mã OTP không hợp lệ!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {step === 1 ? "Quên Mật Khẩu? 🔒" : "Nhập Mã OTP ✉️"}
          </h2>
          <p style={styles.subtitle}>
            {step === 1
              ? "Nhập email của bạn để nhận mã xác thực 6 số"
              : `Mã đã được gửi tới ${email}`}
          </p>
        </div>

        {errorMsg && <div style={styles.errorBox}>⚠️ {errorMsg}</div>}
        {message && step === 2 && (
          <div style={styles.successBox}>✅ {message}</div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendEmail} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Địa chỉ Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="VD: email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Đã xóa required ở đây
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
              {isLoading ? "Đang gửi..." : "Gửi Mã OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mã OTP (6 số)</label>
              <input
                style={{
                  ...styles.input,
                  textAlign: "center",
                  letterSpacing: "5px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
                type="text"
                maxLength="6"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                // Đã xóa required ở đây
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                // Đã xóa required và minLength ở đây
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
              {isLoading ? "Đang xác thực..." : "Cập Nhật Mật Khẩu"}
            </button>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <span
                onClick={handleTryAnotherEmail}
                style={{ ...styles.link, cursor: "pointer", fontSize: "13px" }}
              >
                Thử dùng email khác
              </span>
            </div>
          </form>
        )}

        <div style={styles.footer}>
          Nhớ mật khẩu rồi?{" "}
          <Link to="/login" style={styles.link}>
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

// CSS giữ nguyên
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
  header: { textAlign: "center", marginBottom: "35px" },
  title: {
    margin: "0 0 10px 0",
    color: "#0866ff",
    fontSize: "28px",
    fontWeight: "800",
  },
  subtitle: { margin: "0", color: "#64748b", fontSize: "15px" },
  errorBox: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontSize: "14px",
    borderLeft: "4px solid #e11d48",
  },
  successBox: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontSize: "14px",
    borderLeft: "4px solid #16a34a",
  },
  form: { display: "flex", flexDirection: "column", gap: "22px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", color: "#334155", fontWeight: "600" },
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
  btnDisabled: { backgroundColor: "#94a3b8", cursor: "not-allowed" },
  footer: {
    marginTop: "30px",
    textAlign: "center",
    fontSize: "14px",
    color: "#64748b",
  },
  link: { color: "#0866ff", textDecoration: "none", fontWeight: "600" },
};

export default ForgotPassword;
