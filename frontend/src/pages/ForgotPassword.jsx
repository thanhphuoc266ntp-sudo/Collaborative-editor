import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { forgotPasswordStyles as styles } from "../styles/forgotPasswordStyles";

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

export default ForgotPassword;
