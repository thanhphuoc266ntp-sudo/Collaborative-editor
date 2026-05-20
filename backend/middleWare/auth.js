const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Không có token xác thực.",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : authHeader;

    if (!token) {
      return res.status(401).json({
        message: "Token không hợp lệ.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.userId ||
      decoded.user?.id ||
      decoded.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Token không chứa thông tin người dùng.",
      });
    }

    req.user = {
      id: userId,
      _id: userId,
      userId,
      email: decoded.email || decoded.user?.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token hết hạn hoặc không hợp lệ.",
    });
  }
};

module.exports = auth;
