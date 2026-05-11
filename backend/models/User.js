const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 6 },
    displayName: { type: String, required: true },
    userColor: { type: String, default: "#0088ff" },
    googleId: { type: String },
    resetPasswordOtp: String, // Thay token bằng OTP
    resetPasswordOtpExpires: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
