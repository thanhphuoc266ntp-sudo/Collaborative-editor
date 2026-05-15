require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SENDER_EMAIL = "iorisei1001@gmail.com";

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateUserColor = () => {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
};

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
};

const sendOtpEmail = async ({ to, subject, otp, type }) => {
  const title =
    type === "register"
      ? "Chào mừng bạn đến với Hệ thống Soạn thảo!"
      : "Yêu cầu đặt lại mật khẩu";

  const color = type === "register" ? "#28a745" : "#0866ff";

  const emailData = {
    sender: {
      name: "Hệ thống Soạn thảo",
      email: SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>${title}</h2>
        <p>Mã OTP của bạn là:</p>
        <h1 style="color: ${color}; font-size: 40px; letter-spacing: 5px;">${otp}</h1>
        <p>Mã này có hiệu lực trong 15 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
      </div>
    `,
  };

  await axios.post("https://api.brevo.com/v3/smtp/email", emailData, {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanDisplayName = displayName.trim();

    if (cleanUsername.length < 3) {
      return res.status(400).json({
        message: "Tên đăng nhập phải có ít nhất 3 ký tự!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự!",
      });
    }

    const existingEmailUser = await User.findOne({ email: cleanEmail });
    const existingUsernameUser = await User.findOne({
      username: cleanUsername,
    });

    if (existingEmailUser && existingEmailUser.isVerified !== false) {
      return res.status(400).json({
        message: "Email này đã được đăng ký!",
      });
    }

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
      existingEmailUser.displayName = cleanDisplayName;
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
        displayName: cleanDisplayName,
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

exports.verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ email và mã OTP!",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordOtp: otp.trim(),
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Mã OTP không chính xác hoặc đã hết hạn!",
      });
    }

    user.isVerified = true;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    const token = createToken(user);

    res.json({
      message: "Xác thực thành công! Chào mừng bạn.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        color: user.userColor,
      },
    });
  } catch (error) {
    console.error("Lỗi xác thực đăng ký:", error);
    res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập tên đăng nhập và mật khẩu!",
      });
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user || !user.password) {
      return res.status(400).json({
        message: "Tên đăng nhập không đúng hoặc tài khoản này dùng Google!",
      });
    }

    if (user.isVerified === false) {
      return res.status(403).json({
        message: "Tài khoản chưa xác thực OTP. Vui lòng kiểm tra email!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không chính xác!",
      });
    }

    const token = createToken(user);

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        color: user.userColor,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({
      message: "Lỗi server!",
    });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Thiếu Google ID Token!",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const displayName = payload.name || email.split("@")[0];

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: email.split("@")[0] + "_" + Math.floor(Math.random() * 10000),
        email,
        googleId,
        displayName,
        userColor: generateUserColor(),
        isVerified: true,
      });

      await user.save();
    } else {
      user.googleId = user.googleId || googleId;
      user.displayName = user.displayName || displayName;
      user.userColor = user.userColor || generateUserColor();
      user.isVerified = true;
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;

      await user.save();
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Đăng nhập Google thành công!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        color: user.userColor,
      },
    });
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    res.status(500).json({
      message: "Xác thực Google thất bại!",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Vui lòng nhập email!",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản với email này!",
      });
    }

    const otp = generateOtp();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.json({
      message: "Mã OTP đang được gửi đến email của bạn!",
    });

    sendOtpEmail({
      to: user.email,
      subject: "Mã OTP Khôi phục mật khẩu",
      otp,
      type: "forgot",
    }).catch((error) => {
      console.error(
        "Lỗi gửi OTP quên mật khẩu:",
        error.response?.data || error.message,
      );
    });
  } catch (error) {
    console.error("Lỗi quên mật khẩu:", error.response?.data || error.message);
    res.status(500).json({
      message: "Lỗi hệ thống khi gửi email!",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu mới phải có ít nhất 6 ký tự!",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordOtp: otp.trim(),
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Mã OTP không chính xác hoặc đã hết hạn!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.isVerified = true;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.json({
      message: "Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({
      message: "Lỗi hệ thống!",
    });
  }
};
