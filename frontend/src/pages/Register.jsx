import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { registerStyles as styles } from "../styles/registerStyles";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) setErrorMsg("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, displayName } =
      formData;

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

    if (username.trim().length < 3) {
      setErrorMsg("Tên đăng nhập phải có ít nhất 3 ký tự!");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });

      setRegisteredEmail(res.data.email || email.trim());
      setSuccessMsg(res.data.message);
      setStep(2);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại sau!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrorMsg("Vui lòng nhập mã OTP!");
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMsg("Mã OTP phải gồm 6 số!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/verify-registration", {
        email: registeredEmail,
        otp: otp.trim(),
      });

      localStorage.setItem("token", res.data.token);
      alert("Xác thực thành công! Chào mừng bạn.");
      navigate("/");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

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
          <div style={styles.logoCircle}>{step === 1 ? "✨" : "✉️"}</div>

          <h2 style={styles.title}>
            {step === 1 ? "Tham gia ngay!" : "Xác thực Email"}
          </h2>

          <p style={styles.subtitle}>
            {step === 1
              ? "Tạo tài khoản để cùng nhau làm việc"
              : `Mã OTP đang được gửi tới ${registeredEmail}`}
          </p>
        </div>

        {errorMsg && (
          <div style={styles.errorBox}>
            <span style={styles.boxIcon}>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 2 && successMsg && !errorMsg && (
          <div style={styles.successBox}>
            <span style={styles.boxIcon}>✅</span>
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 && (
          <>
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
                <label style={styles.label}>Tên hiển thị</label>
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
                <label style={styles.label}>Mật khẩu</label>
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Xác nhận mật khẩu</label>
                <input
                  style={styles.input}
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
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
                {isLoading ? "Đang tạo tài khoản..." : "Hoàn Tất Đăng Ký"}
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
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nhập mã OTP gồm 6 số</label>
              <input
                style={styles.otpInput}
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, ""));
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
                ...(isLoading ? styles.submitBtnDisabled : {}),
              }}
            >
              {isLoading ? "Đang kiểm tra..." : "Xác Nhận & Đăng Nhập"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              disabled={isLoading}
              style={styles.backBtn}
            >
              Quay lại chỉnh sửa Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
