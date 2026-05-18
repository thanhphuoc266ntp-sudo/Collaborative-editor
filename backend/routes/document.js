const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Document = require("../models/Document");
const User = require("../models/User");

router.post("/create", async (req, res) => {
  try {
    const { userId, title } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "userId không hợp lệ",
      });
    }

    const userExists = await User.findById(userId);

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng để tạo tài liệu",
      });
    }

    const newDoc = new Document({
      title: title || "Tài liệu không tên",
      owner: userId,
      content: "",
    });

    await newDoc.save();

    res.status(201).json({
      success: true,
      message: "Tạo tài liệu thành công",
      documentId: newDoc.documentId,
      id: newDoc._id,
      document: newDoc,
    });
  } catch (error) {
    console.error("Lỗi server khi tạo tài liệu:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi tạo tài liệu",
    });
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

    res.json({
      success: true,
      documents: docs,
    });
  } catch (error) {
    console.error("Lỗi tải danh sách tài liệu:", error);

    res.status(500).json({
      success: false,
      message: "Lỗi server khi tải danh sách",
    });
  }
});

router.post("/share", async (req, res) => {
  try {
    const { documentId, shareWithUsername, role } = req.body;

    if (!documentId || !shareWithUsername) {
      return res.status(400).json({
        success: false,
        message: "Thiếu documentId hoặc tên người dùng cần chia sẻ",
      });
    }

    const targetUser = await User.findOne({
      username: shareWithUsername,
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng này!",
      });
    }

    const updatedDoc = await Document.findOneAndUpdate(
      { documentId },
      {
        $addToSet: {
          collaborators: {
            user: targetUser._id,
            role: role || "editor",
          },
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài liệu!",
      });
    }

    res.json({
      success: true,
      message: `Đã chia sẻ quyền ${role || "editor"} cho ${shareWithUsername}`,
      document: updatedDoc,
    });
  } catch (error) {
    console.error("Lỗi chia sẻ tài liệu:", error);

    res.status(500).json({
      success: false,
      message: "Lỗi server khi chia sẻ",
    });
  }
});

router.get("/:documentId", async (req, res) => {
  try {
    const document = await Document.findOne({
      documentId: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài liệu",
      });
    }

    res.json({
      success: true,
      document: {
        id: document._id,
        documentId: document.documentId,
        title: document.title,
        content: document.content || "",
        owner: document.owner,
        folderId: document.folderId,
        collaborators: document.collaborators,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });
  } catch (error) {
    console.error("Lỗi tải tài liệu:", error);

    res.status(500).json({
      success: false,
      message: "Lỗi server khi tải tài liệu",
    });
  }
});

router.put("/:documentId", async (req, res) => {
  try {
    const { content, title } = req.body;

    const updateData = {};

    if (content !== undefined) {
      updateData.content = String(content);
    }

    if (title !== undefined) {
      updateData.title = title || "Tài liệu không tên";
    }

    const updatedDocument = await Document.findOneAndUpdate(
      { documentId: req.params.documentId },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài liệu",
      });
    }

    res.json({
      success: true,
      message: "Đã lưu tài liệu",
      document: {
        id: updatedDocument._id,
        documentId: updatedDocument.documentId,
        title: updatedDocument.title,
        content: updatedDocument.content || "",
        owner: updatedDocument.owner,
        folderId: updatedDocument.folderId,
        collaborators: updatedDocument.collaborators,
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt,
      },
    });
  } catch (error) {
    console.error("Lỗi lưu tài liệu:", error);

    res.status(500).json({
      success: false,
      message: "Lỗi server khi lưu tài liệu",
    });
  }
});

module.exports = router;
