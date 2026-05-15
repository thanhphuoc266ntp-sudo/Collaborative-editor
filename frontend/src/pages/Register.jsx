import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { GoogleLogin } from "@react-oauth/google";

exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    const existingEmailUser = await User.findOne({ email: cleanEmail });

    if (existingEmailUser && existingEmailUser.isVerified !== false) {
      return res.status(400).json({
        message: "Email này đã được đăng ký!",
      });
    }

    const existingUsernameUser = await User.findOne({
      username: cleanUsername,
    });

    if (existingUsernameUser && existingUsernameUser.email !== cleanEmail) {
      return res.status(400).json({
        message: "Tên đăng nhập đã tồn tại!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOtp();

    let user;

    if (existingEmailUser && existingEmailUser.isVerified === false) {
      existingEmailUser.username = cleanUsername;
      existingEmailUser.password = hashedPassword;
      existingEmailUser.displayName = displayName.trim();
      existingEmailUser.userColor =
        existingEmailUser.userColor || generateUserColor();
      existingEmailUser.resetPasswordOtp = otp;
      existingEmailUser.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000;

      user = await existingEmailUser.save();
    } else {
      user = new User({
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        displayName: displayName.trim(),
        userColor: generateUserColor(),
        isVerified: false,
        resetPasswordOtp: otp,
        resetPasswordOtpExpires: Date.now() + 15 * 60 * 1000,
      });

      await user.save();
    }

    res.status(201).json({
      message: "Mã OTP đang được gửi đến email của bạn.",
      email: user.email,
    });

    sendOtpEmail({
      to: user.email,
      subject: "Mã OTP Xác thực tài khoản mới",
      otp,
      type: "register",
    }).catch((error) => {
      console.error(
        "Lỗi gửi OTP đăng ký:",
        error.response?.data || error.message,
      );
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error.response?.data || error.message);
    res.status(500).json({
      message: "Lỗi server, vui lòng thử lại sau!",
    });
  }
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
    maxWidth: "430px",
    padding: "42px 38px",
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
    gap: "17px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
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
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
    transition: "all 0.2s ease",
  },
  submitBtnDisabled: {
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
    fontWeight: "700",
    marginLeft: "6px",
  },
};

export default Register;
