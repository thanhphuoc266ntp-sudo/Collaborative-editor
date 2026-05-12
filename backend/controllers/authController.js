const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1. ĐĂNG KÝ TÀI KHOẢN (Tạo user, gửi mã OTP, chưa cho đăng nhập)
exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc Email đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo mã OTP 6 số để xác thực đăng ký
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      displayName,
      userColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      // Lưu tạm OTP vào đây để check xác thực
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: Date.now() + 15 * 60 * 1000,
    });

    await newUser.save();

    // Gọi API của Brevo để gửi mail OTP đăng ký
    const emailData = {
      sender: {
        name: "Hệ thống Soạn thảo",
        email: "thanhphuoc266.ntp@gmail.com",
      },
      to: [{ email: newUser.email }],
      subject: "Mã OTP Xác thực tài khoản mới",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Chào mừng bạn đến với Hệ thống Soạn thảo!</h2>
          <p>Mã OTP để kích hoạt tài khoản của bạn là:</p>
          <h1 style="color: #28a745; font-size: 40px; letter-spacing: 5px;">${otp}</h1>
          <p>Mã này có hiệu lực trong 15 phút. Vui lòng nhập mã này trên web để hoàn tất đăng ký.</p>
        </div>
      `,
    };

    const config = {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, config);

    // Gửi phản hồi về frontend (KHÔNG kèm token đăng nhập)
    res.status(201).json({
      message: "Mã xác thực đã được gửi vào Email của bạn. Vui lòng kiểm tra!",
      email: newUser.email,
    });
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau!" });
  }
};

// 2. XÁC THỰC ĐĂNG KÝ (Nhập OTP để hoàn tất và lấy Token đăng nhập)
exports.verifyRegistration = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Tìm user có email và mã OTP hợp lệ
    const user = await User.findOne({
      email: email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Mã OTP không chính xác hoặc đã hết hạn!" });
    }

    // Xác thực thành công -> Xóa mã OTP
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    // Cấp Token để đăng nhập thẳng vào hệ thống
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

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
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

// 3. ĐĂNG NHẬP BÌNH THƯỜNG
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !user.password) {
      return res.status(400).json({
        message:
          "Tên đăng nhập không đúng hoặc tài khoản này dùng Google để đăng nhập!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

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
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// 4. ĐĂNG NHẬP BẰNG GOOGLE
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name: displayName } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: email.split("@")[0] + "_" + Math.floor(Math.random() * 10000),
        email,
        googleId,
        displayName,
        userColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

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
    res.status(500).json({ message: "Xác thực Google thất bại!" });
  }
};

// 5. QUÊN MẬT KHẨU (Gửi OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản với email này!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const emailData = {
      sender: {
        name: "Hệ thống Soạn thảo",
        email: "thanhphuoc266.ntp@gmail.com",
      },
      to: [{ email: user.email }],
      subject: "Mã OTP Khôi phục mật khẩu",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Yêu cầu đặt lại mật khẩu</h2>
          <p>Mã OTP xác thực của bạn là:</p>
          <h1 style="color: #0866ff; font-size: 40px; letter-spacing: 5px;">${otp}</h1>
          <p>Mã này có hiệu lực trong 15 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
        </div>
      `,
    };

    const config = {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    };

    await axios.post("https://api.brevo.com/v3/smtp/email", emailData, config);

    res.json({ message: "Mã OTP đã được gửi đến email của bạn!" });
  } catch (error) {
    console.error(
      "Lỗi gửi email Brevo:",
      error.response?.data || error.message,
    );
    res.status(500).json({ message: "Lỗi hệ thống khi gửi email!" });
  }
};

// 6. ĐẶT LẠI MẬT KHẨU (Xác thực OTP)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email: email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Mã OTP không chính xác hoặc đã hết hạn!" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.json({
      message: "Đổi mật khẩu thành công! Bạn có thể đăng nhập ngay.",
    });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
