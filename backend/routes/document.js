const express = require("express");
const Document = require("../models/Document");
const User = require("../models/User");
const auth = require("../middleWare/auth");

const router = express.Router();

const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId;
};

const normalizeTitle = (title) => {
  if (!title || !String(title).trim()) return "Tài liệu không tên";
  return String(title).trim();
};

const normalizeFolderId = (folderId) => {
  const validFolders = ["web-project", "crypto", "notes"];

  if (validFolders.includes(folderId)) {
    return folderId;
  }

  return "web-project";
};

const canAccessDocument = (document, userId) => {
  if (!document || !userId) return false;

  const ownerId = String(document.owner?._id || document.owner);

  if (ownerId === String(userId)) return true;

  return document.collaborators.some((collaborator) => {
    const collaboratorId = String(collaborator.user?._id || collaborator.user);
    return collaboratorId === String(userId);
  });
};

const canEditDocument = (document, userId) => {
  if (!document || !userId) return false;

  const ownerId = String(document.owner?._id || document.owner);

  if (ownerId === String(userId)) return true;

  return document.collaborators.some((collaborator) => {
    const collaboratorId = String(collaborator.user?._id || collaborator.user);
    return collaboratorId === String(userId) && collaborator.role === "editor";
  });
};

router.post("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, folderId } = req.body;

    const document = await Document.create({
      title: normalizeTitle(title),
      owner: userId,
      folderId: normalizeFolderId(folderId),
    });

    const safeDocument = await Document.findById(document._id)
      .select("-yState")
      .populate("owner", "name email");

    return res.status(201).json({
      message: "Tạo tài liệu thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Create document error:", error);

    return res.status(500).json({
      message: "Lỗi server khi tạo tài liệu.",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);

    const documents = await Document.find({
      owner: userId,
    })
      .select("-yState")
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });

    return res.json({
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);

    return res.status(500).json({
      message: "Lỗi server khi lấy danh sách tài liệu.",
    });
  }
});

router.get("/shared-with-me", auth, async (req, res) => {
  try {
    const userId = getUserId(req);

    const documents = await Document.find({
      "collaborators.user": userId,
      owner: {
        $ne: userId,
      },
    })
      .select("-yState")
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });

    return res.json({
      documents,
    });
  } catch (error) {
    console.error("Get shared documents error:", error);

    return res.status(500).json({
      message: "Lỗi server khi lấy tài liệu được chia sẻ.",
    });
  }
});

router.get("/:documentId", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;

    const document = await Document.findById(documentId)
      .select("-yState")
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    if (!canAccessDocument(document, userId)) {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập tài liệu này.",
      });
    }

    return res.json({
      document,
    });
  } catch (error) {
    console.error("Get document by id error:", error);

    return res.status(500).json({
      message: "Lỗi server khi lấy tài liệu.",
    });
  }
});

router.put("/:documentId/title", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { title } = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    if (!canEditDocument(document, userId)) {
      return res.status(403).json({
        message: "Bạn không có quyền đổi tên tài liệu này.",
      });
    }

    document.title = normalizeTitle(title);
    await document.save();

    const safeDocument = await Document.findById(document._id)
      .select("-yState")
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    return res.json({
      message: "Đổi tên tài liệu thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Update title error:", error);

    return res.status(500).json({
      message: "Lỗi server khi đổi tên tài liệu.",
    });
  }
});

router.put("/:documentId/folder", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { folderId } = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    const ownerId = String(document.owner?._id || document.owner);

    if (ownerId !== String(userId)) {
      return res.status(403).json({
        message: "Chỉ chủ sở hữu mới được chuyển thư mục tài liệu.",
      });
    }

    document.folderId = normalizeFolderId(folderId);
    await document.save();

    const safeDocument = await Document.findById(document._id)
      .select("-yState")
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    return res.json({
      message: "Cập nhật thư mục thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Update folder error:", error);

    return res.status(500).json({
      message: "Lỗi server khi cập nhật thư mục.",
    });
  }
});

router.post("/:documentId/share", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { email, role } = req.body;

    if (!email || !String(email).trim()) {
      return res.status(400).json({
        message: "Vui lòng nhập email người nhận.",
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    const ownerId = String(document.owner?._id || document.owner);

    if (ownerId !== String(userId)) {
      return res.status(403).json({
        message: "Chỉ chủ sở hữu mới được chia sẻ tài liệu.",
      });
    }

    const targetUser = await User.findOne({
      email: String(email).trim().toLowerCase(),
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng với email này.",
      });
    }

    if (String(targetUser._id) === String(userId)) {
      return res.status(400).json({
        message: "Bạn không cần chia sẻ tài liệu cho chính mình.",
      });
    }

    const nextRole = role === "editor" ? "editor" : "viewer";

    const existedCollaborator = document.collaborators.find(
      (collaborator) => String(collaborator.user) === String(targetUser._id),
    );

    if (existedCollaborator) {
      existedCollaborator.role = nextRole;
    } else {
      document.collaborators.push({
        user: targetUser._id,
        role: nextRole,
      });
    }

    await document.save();

    const safeDocument = await Document.findById(document._id)
      .select("-yState")
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    return res.json({
      message: "Chia sẻ tài liệu thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Share document error:", error);

    return res.status(500).json({
      message: "Lỗi server khi chia sẻ tài liệu.",
    });
  }
});

router.delete("/:documentId", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    const ownerId = String(document.owner?._id || document.owner);

    if (ownerId !== String(userId)) {
      return res.status(403).json({
        message: "Chỉ chủ sở hữu mới được xóa tài liệu.",
      });
    }

    await Document.deleteOne({
      _id: documentId,
    });

    return res.json({
      message: "Xóa tài liệu thành công.",
    });
  } catch (error) {
    console.error("Delete document error:", error);

    return res.status(500).json({
      message: "Lỗi server khi xóa tài liệu.",
    });
  }
});

module.exports = router;
