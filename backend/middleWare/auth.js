const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || req.header("Authorization");

  if (!authHeader) return null;

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return authHeader;
};

const getUserIdFromDecodedToken = (decoded) => {
  return (
    decoded.id ||
    decoded._id ||
    decoded.userId ||
    decoded.user?.id ||
    decoded.user?._id ||
    decoded.data?.id ||
    decoded.data?._id ||
    decoded.data?.userId ||
    null
  );
};

const getEmailFromDecodedToken = (decoded) => {
  return (
    decoded.email ||
    decoded.user?.email ||
    decoded.data?.email ||
    decoded.payload?.email ||
    null
  );
};

const auth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        message: "Không có token xác thực.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let userId = getUserIdFromDecodedToken(decoded);
    const email = getEmailFromDecodedToken(decoded);

    if (!userId && email) {
      const user = await User.findOne({
        email: String(email).trim().toLowerCase(),
      }).select("_id email name");

      if (user) {
        userId = user._id;
      }
    }

    if (!userId) {
      return res.status(401).json({
        message: "Token không chứa thông tin người dùng.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(String(userId))) {
      return res.status(401).json({
        message: "Thông tin người dùng trong token không hợp lệ.",
      });
    }

    req.user = {
      id: String(userId),
      _id: String(userId),
      userId: String(userId),
      email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token hết hạn hoặc không hợp lệ.",
    });
  }
};

module.exports = auth;
