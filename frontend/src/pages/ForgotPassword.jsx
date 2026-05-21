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
      setErrorMsg("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setErrorMsg("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(res.data.message || "Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          "Không thể gửi mã OTP. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp.trim() || !newPassword.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ mã OTP và mật khẩu mới.");
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMsg("Mã OTP phải gồm đúng 6 chữ số.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
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

      setMessage(res.data.message || "Cập nhật mật khẩu thành công.");
      setErrorMsg("");

      setTimeout(() => {
        navigate("/login");
      }, 1600);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoCircle}>{step === 1 ? "🔐" : "✉️"}</div>

          <h2 style={styles.title}>
            {step === 1 ? "Khôi phục mật khẩu" : "Xác thực OTP"}
          </h2>

          <p style={styles.subtitle}>
            {step === 1
              ? "Nhập email để nhận mã xác thực đặt lại mật khẩu"
              : "Nhập mã xác thực đã được gửi đến email của bạn"}
          </p>

          {step === 2 && <p style={styles.emailText}>{email}</p>}
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
              <label style={styles.label}>Địa chỉ email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="Email của bạn"
                value={email}
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) {
                    setErrorMsg("");
                  }
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
              {isLoading ? "Đang gửi mã..." : "Gửi mã OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Mã OTP gồm 6 số</label>
              <input
                style={styles.otpInput}
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="000000"
                value={otp}
                autoComplete="one-time-code"
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  if (errorMsg) {
                    setErrorMsg("");
                  }
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                autoComplete="new-password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMsg) {
                    setErrorMsg("");
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitBtn,
                ...styles.submitBtnSuccess,
                ...(isLoading ? styles.btnDisabled : {}),
              }}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>

            <button
              type="button"
              onClick={handleTryAnotherEmail}
              disabled={isLoading}
              style={styles.backBtn}
            >
              Dùng email khác
            </button>
          </form>
        )}

        <div style={styles.footer}>
          Đã nhớ mật khẩu?{" "}
          <Link to="/login" style={styles.link}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
