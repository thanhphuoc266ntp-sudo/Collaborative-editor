const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const User = require("../models/User");

router.post("/create", async (req, res) => {
  try {
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    }

    const newDoc = new Document({
      title: title || "Tài liệu không tên",
      owner: userId,
    });

    await newDoc.save();

    res.status(201).json({
      success: true,
      documentId: newDoc.documentId,
      id: newDoc._id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tạo tài liệu" });
  }
});

router.get("/my-docs/:userId", async (req, res) => {
  try {
    const docs = await Document.find({
      $or: [
        { owner: req.params.userId },
        { "collaborators.user": req.params.userId },
      ],
    }).sort({ updatedAt: -1 });

    res.json({ success: true, documents: docs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tải danh sách" });
  }
});

router.post("/share", async (req, res) => {
  try {
    const { documentId, shareWithUsername, role } = req.body;

    const targetUser = await User.findOne({ username: shareWithUsername });
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng này!" });
    }

    const updatedDoc = await Document.findOneAndUpdate(
      { documentId: documentId },
      {
        $addToSet: {
          collaborators: { user: targetUser._id, role: role || "editor" },
        },
      },
      { new: true },
    );

    if (!updatedDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài liệu!" });
    }

    res.json({
      success: true,
      message: `Đã chia sẻ quyền ${role || "editor"} cho ${shareWithUsername}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server khi chia sẻ" });
  }
});

module.exports = router;
