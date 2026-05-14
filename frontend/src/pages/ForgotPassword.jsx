import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTryAnotherEmail = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setMessage("");
    setErrorMsg("");
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

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

      setMessage(res.data.message || "Mã OTP đang được gửi đến email của bạn!");
      setStep(2);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim() || !newPassword.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!");
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMsg("Mã OTP phải có đúng 6 chữ số!");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setErrorMsg("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      setMessage(res.data.message || "Đổi mật khẩu thành công!");
      setErrorMsg("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoCircle}>{step === 1 ? "🔒" : "✉️"}</div>

          <h2 style={styles.title}>
            {step === 1 ? "Quên Mật Khẩu?" : "Nhập Mã OTP"}
          </h2>

          <p style={styles.subtitle}>
            {step === 1
              ? "Nhập email của bạn để nhận mã xác thực 6 số"
              : `Mã OTP đang được gửi tới ${email}`}
          </p>
        </div>

        {errorMsg && (
          <div style={styles.errorBox}>
            <span style={styles.boxIcon}>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {message && step === 2 && !errorMsg && (
          <div style={styles.successBox}>
            <span style={styles.boxIcon}>✅</span>
            <span>{message}</span>
          </div>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
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
              {isLoading ? "Đang xử lý..." : "Gửi Mã OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mã OTP gồm 6 số</label>
              <input
                style={styles.otpInput}
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  if (errorMsg) setErrorMsg("");
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitBtn,
                backgroundColor: "#10b981",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.39)",
                ...(isLoading ? styles.btnDisabled : {}),
              }}
            >
              {isLoading ? "Đang xác thực..." : "Cập Nhật Mật Khẩu"}
            </button>

            <button
              type="button"
              onClick={handleTryAnotherEmail}
              disabled={isLoading}
              style={styles.backBtn}
            >
              Thử dùng email khác
            </button>
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
    padding: "44px 38px",
    borderRadius: "26px",
    boxShadow:
      "0 22px 45px -14px rgba(15, 23, 42, 0.35), 0 12px 22px -12px rgba(15, 23, 42, 0.22)",
    boxSizing: "border-box",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  logoCircle: {
    width: "58px",
    height: "58px",
    margin: "0 auto 14px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #eff6ff, #ede9fe)",
    fontSize: "26px",
  },
  title: {
    margin: "0 0 10px 0",
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
    lineHeight: "1.5",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "14px 16px",
    borderRadius: "14px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    lineHeight: "1.4",
  },
  successBox: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "14px 16px",
    borderRadius: "14px",
    marginBottom: "22px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    lineHeight: "1.4",
  },
  boxIcon: {
    marginRight: "8px",
    flexShrink: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#334155",
    fontWeight: "650",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "13px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
  },
  otpInput: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    fontSize: "24px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    textAlign: "center",
    letterSpacing: "7px",
    fontWeight: "800",
  },
  submitBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "16px",
    backgroundColor: "#0866ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "13px",
    fontSize: "16px",
    fontWeight: "750",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(8, 102, 255, 0.39)",
  },
  btnDisabled: {
    backgroundColor: "#94a3b8",
    boxShadow: "none",
    cursor: "wait",
  },
  backBtn: {
    width: "100%",
    padding: "15px",
    backgroundColor: "transparent",
    color: "#64748b",
    border: "1px solid #cbd5e1",
    borderRadius: "13px",
    fontSize: "15px",
    fontWeight: "650",
    cursor: "pointer",
    boxShadow: "none",
    marginTop: "0px",
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
    fontWeight: "700",
  },
};

export default ForgotPassword;
