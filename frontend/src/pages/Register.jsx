import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();

  // Thêm state "step" để biết đang ở bước 1 (Điền form) hay bước 2 (Nhập OTP)
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

  // --- BƯỚC 1: XỬ LÝ ĐĂNG KÝ (GỌI API GỬI MAIL) ---
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

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/register", {
        username: username.trim(),
        email: email.trim(),
        password: password,
        displayName: displayName.trim(),
      });

      // Đăng ký thành công -> Lưu email lại và chuyển sang bước 2 (Nhập OTP)
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

  // --- BƯỚC 2: XỬ LÝ XÁC NHẬN OTP ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMsg("Vui lòng nhập mã OTP!");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await API.post("/auth/verify-registration", {
        email: registeredEmail,
        otp: otp.trim(),
      });

      // Nếu thành công -> Lưu token và cho vào thẳng trang chủ
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
          <h2 style={styles.title}>
            {step === 1 ? "Tham gia ngay! ✨" : "Xác thực Email ✉️"}
          </h2>
          <p style={styles.subtitle}>
            {step === 1
              ? "Tạo tài khoản để cùng nhau làm việc"
              : `Mã 6 số đã được gửi tới ${registeredEmail}`}
          </p>
        </div>

        {errorMsg && (
          <div style={styles.errorBox}>
            <span style={{ marginRight: "8px" }}>⚠️</span> {errorMsg}
          </div>
        )}

        {/* Hiển thị thông báo thành công khi chuyển sang bước 2 */}
        {step === 2 && successMsg && !errorMsg && (
          <div
            style={{
              ...styles.errorBox,
              backgroundColor: "#dcfce7",
              color: "#166534",
            }}
          >
            <span style={{ marginRight: "8px" }}>✅</span> {successMsg}
          </div>
        )}

        {/* --- GIAO DIỆN BƯỚC 1: FORM ĐĂNG KÝ --- */}
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
          </>
        )}

        {/* --- GIAO DIỆN BƯỚC 2: FORM NHẬP OTP --- */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nhập mã OTP (6 số)</label>
              <input
                style={{
                  ...styles.input,
                  textAlign: "center",
                  fontSize: "20px",
                  letterSpacing: "4px",
                }}
                type="text"
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/[^0-9]/g, "")); // Chỉ cho phép nhập số
                  if (errorMsg) setErrorMsg("");
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitBtn,
                backgroundColor: "#10b981", // Đổi màu xanh lá cho nút xác nhận
                boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)",
                ...(isLoading ? styles.submitBtnDisabled : {}),
              }}
            >
              {isLoading ? "Đang kiểm tra..." : "Xác Nhận & Đăng Nhập"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)} // Nút quay lại bước 1
              style={{
                ...styles.submitBtn,
                backgroundColor: "transparent",
                color: "#64748b",
                boxShadow: "none",
                marginTop: "0px",
                border: "1px solid #cbd5e1",
              }}
            >
              Quay lại chỉnh sửa Email
            </button>
          </form>
        )}
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
