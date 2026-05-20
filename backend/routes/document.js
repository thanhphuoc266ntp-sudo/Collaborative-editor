const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const document = await Document.create({
      title: req.body.title || "Tài liệu không tên",
      owner: req.user.id,
      folderId: req.body.folderId || "root",
      content: "",
      yState: null,
      collaborators: [],
    });

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Lỗi tạo tài liệu:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tạo tài liệu",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const documents = await Document.find({
      owner: req.user.id,
    })
      .sort({ updatedAt: -1 })
      .select("title documentId folderId updatedAt createdAt");

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách tài liệu:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách tài liệu",
    });
  }
});

router.get("/shared-with-me", auth, async (req, res) => {
  try {
    const documents = await Document.find({
      "collaborators.user": req.user.id,
    })
      .populate("owner", "name email")
      .sort({ updatedAt: -1 })
      .select("title documentId owner collaborators updatedAt createdAt");

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Lỗi lấy tài liệu được chia sẻ:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy tài liệu được chia sẻ",
    });
  }
});

router.get("/:documentId", auth, async (req, res) => {
  try {
    const document = await Document.findOne({
      documentId: req.params.documentId,
    }).populate("owner", "name email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài liệu",
      });
    }

    const isOwner = document.owner?._id?.toString() === req.user.id;
    const isCollaborator = document.collaborators.some(
      (item) => item.user.toString() === req.user.id,
    );

    if (!isOwner && !isCollaborator) {
      return res.json({
        success: true,
        document,
        permission: "link",
      });
    }

    res.json({
      success: true,
      document,
      permission: isOwner ? "owner" : "collaborator",
    });
  } catch (error) {
    console.error("Lỗi lấy tài liệu:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy tài liệu",
    });
  }
});

router.put("/:documentId/title", auth, async (req, res) => {
  try {
    const title = req.body.title?.trim() || "Tài liệu không tên";

    const document = await Document.findOne({
      documentId: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài liệu",
      });
    }

    const isOwner = document.owner?.toString() === req.user.id;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền đổi tên tài liệu",
      });
    }

    document.title = title;
    await document.save();

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Lỗi đổi tên tài liệu:", error);
    res.status(500).json({
      success: false,
      message: "Không thể đổi tên tài liệu",
    });
  }
});

router.post("/:documentId/share", auth, async (req, res) => {
  try {
    const { userId, role } = req.body;

    const document = await Document.findOne({
      documentId: req.params.documentId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài liệu",
      });
    }

    const isOwner = document.owner?.toString() === req.user.id;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chia sẻ tài liệu",
      });
    }

    const existingCollaborator = document.collaborators.find(
      (item) => item.user.toString() === userId,
    );

    if (existingCollaborator) {
      existingCollaborator.role = role || "editor";
    } else {
      document.collaborators.push({
        user: userId,
        role: role || "editor",
      });
    }

    await document.save();

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Lỗi chia sẻ tài liệu:", error);
    res.status(500).json({
      success: false,
      message: "Không thể chia sẻ tài liệu",
    });
  }
});

router.delete("/:documentId", auth, async (req, res) => {
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

    const isOwner = document.owner?.toString() === req.user.id;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa tài liệu",
      });
    }

    await Document.deleteOne({
      documentId: req.params.documentId,
    });

    res.json({
      success: true,
      message: "Đã xóa tài liệu",
    });
  } catch (error) {
    console.error("Lỗi xóa tài liệu:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa tài liệu",
    });
  }
});

module.exports = router;
