const express = require("express");
const mongoose = require("mongoose");
const Document = require("../models/Document");
const User = require("../models/User");
const auth = require("../middleWare/auth");

const router = express.Router();

const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId || null;
};

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(String(id));
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

const normalizeRole = (role) => {
  return role === "editor" ? "editor" : "viewer";
};

const getDocumentOwnerId = (document) => {
  return String(document.owner?._id || document.owner);
};

const isOwner = (document, userId) => {
  return getDocumentOwnerId(document) === String(userId);
};

const findCollaborator = (document, userId) => {
  return document.collaborators.find((collaborator) => {
    const collaboratorId = String(collaborator.user?._id || collaborator.user);
    return collaboratorId === String(userId);
  });
};

const canAccessDocument = (document, userId) => {
  if (!document || !userId) return false;

  if (isOwner(document, userId)) {
    return true;
  }

  return Boolean(findCollaborator(document, userId));
};

const canEditDocument = (document, userId) => {
  if (!document || !userId) return false;

  if (isOwner(document, userId)) {
    return true;
  }

  const collaborator = findCollaborator(document, userId);

  return Boolean(collaborator && collaborator.role === "editor");
};

const getDocumentPermission = (document, userId) => {
  if (!document || !userId) {
    return {
      myRole: "viewer",
      canView: false,
      canEdit: false,
    };
  }

  if (isOwner(document, userId)) {
    return {
      myRole: "owner",
      canView: true,
      canEdit: true,
    };
  }

  const collaborator = findCollaborator(document, userId);

  if (!collaborator) {
    return {
      myRole: "viewer",
      canView: false,
      canEdit: false,
    };
  }

  const role = normalizeRole(collaborator.role);

  return {
    myRole: role,
    canView: true,
    canEdit: role === "editor",
  };
};

const addCollaboratorIfMissing = async (document, userId, role = "viewer") => {
  if (!document || !userId) return document;

  if (isOwner(document, userId)) {
    return document;
  }

  const existedCollaborator = findCollaborator(document, userId);

  if (existedCollaborator) {
    return document;
  }

  document.collaborators.push({
    user: userId,
    role: normalizeRole(role),
  });

  await document.save();

  return document;
};

const getSafeDocumentById = async (documentId) => {
  return Document.findById(documentId)
    .select("-yState")
    .populate("owner", "name email username displayName")
    .populate("collaborators.user", "name email username displayName");
};

const createNewDocument = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    const { title, folderId } = req.body;

    const document = await Document.create({
      title: normalizeTitle(title),
      owner: userId,
      folderId: normalizeFolderId(folderId),
      collaborators: [],
      shareLink: {
        enabled: false,
        role: "viewer",
      },
    });

    const safeDocument = await getSafeDocumentById(document._id);

    return res.status(201).json({
      message: "Tạo tài liệu thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Create document error:", error);

    if (error.code === 11000) {
      return res.status(500).json({
        message:
          "MongoDB đang còn unique index cũ. Hãy xóa index documentId_1 trong collection documents.",
        detail: error.message,
      });
    }

    return res.status(500).json({
      message: error.message || "Lỗi server khi tạo tài liệu.",
    });
  }
};

router.post("/", auth, createNewDocument);

router.post("/create", auth, createNewDocument);

router.get("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    const documents = await Document.find({
      owner: userId,
    })
      .select("-yState")
      .populate("owner", "name email username displayName")
      .sort({ updatedAt: -1 });

    return res.json({
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi lấy danh sách tài liệu.",
    });
  }
});

router.get("/shared-with-me", auth, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    const documents = await Document.find({
      "collaborators.user": userId,
      owner: {
        $ne: userId,
      },
    })
      .select("-yState")
      .populate("owner", "name email username displayName")
      .populate("collaborators.user", "name email username displayName")
      .sort({ updatedAt: -1 });

    return res.json({
      documents,
    });
  } catch (error) {
    console.error("Get shared documents error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi lấy tài liệu được chia sẻ.",
    });
  }
});

router.put("/:documentId/link-sharing", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { enabled = true, role = "viewer" } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message: "documentId không hợp lệ.",
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    if (!isOwner(document, userId)) {
      return res.status(403).json({
        message: "Chỉ chủ sở hữu mới được bật chia sẻ bằng link.",
      });
    }

    document.shareLink = {
      enabled: Boolean(enabled),
      role: normalizeRole(role),
    };

    await document.save();

    const safeDocument = await getSafeDocumentById(document._id);

    return res.json({
      message: Boolean(enabled)
        ? "Đã bật chia sẻ bằng link."
        : "Đã tắt chia sẻ bằng link.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Update link sharing error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi cập nhật chia sẻ bằng link.",
    });
  }
});

router.get("/:documentId", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message: "documentId không hợp lệ.",
      });
    }

    let document = await Document.findById(documentId)
      .populate("owner", "name email username displayName")
      .populate("collaborators.user", "name email username displayName");

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    if (!canAccessDocument(document, userId)) {
      if (document.shareLink?.enabled) {
        await addCollaboratorIfMissing(
          document,
          userId,
          document.shareLink.role || "viewer",
        );

        document = await Document.findById(documentId)
          .populate("owner", "name email username displayName")
          .populate("collaborators.user", "name email username displayName");
      } else {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập tài liệu này.",
        });
      }
    }

    const permission = getDocumentPermission(document, userId);
    const safeDocument = document.toObject();

    delete safeDocument.yState;

    return res.json({
      document: safeDocument,
      myRole: permission.myRole,
      canView: permission.canView,
      canEdit: permission.canEdit,
    });
  } catch (error) {
    console.error("Get document by id error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi lấy tài liệu.",
    });
  }
});

router.put("/:documentId/title", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { title } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message: "documentId không hợp lệ.",
      });
    }

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

    const safeDocument = await getSafeDocumentById(document._id);

    return res.json({
      message: "Đổi tên tài liệu thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Update title error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi đổi tên tài liệu.",
    });
  }
});

router.put("/:documentId/folder", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { folderId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message: "documentId không hợp lệ.",
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    if (!isOwner(document, userId)) {
      return res.status(403).json({
        message: "Chỉ chủ sở hữu mới được chuyển thư mục tài liệu.",
      });
    }

    document.folderId = normalizeFolderId(folderId);
    await document.save();

    const safeDocument = await getSafeDocumentById(document._id);

    return res.json({
      message: "Cập nhật thư mục thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Update folder error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi cập nhật thư mục.",
    });
  }
});

router.post("/:documentId/share", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;
    const { email, role } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message: "documentId không hợp lệ.",
      });
    }

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

    if (!isOwner(document, userId)) {
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

    const nextRole = normalizeRole(role);
    const existedCollaborator = findCollaborator(document, targetUser._id);

    if (existedCollaborator) {
      existedCollaborator.role = nextRole;
    } else {
      document.collaborators.push({
        user: targetUser._id,
        role: nextRole,
      });
    }

    await document.save();

    const safeDocument = await getSafeDocumentById(document._id);

    return res.json({
      message: "Chia sẻ tài liệu thành công.",
      document: safeDocument,
    });
  } catch (error) {
    console.error("Share document error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi chia sẻ tài liệu.",
    });
  }
});

router.delete("/:documentId", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { documentId } = req.params;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!isValidObjectId(documentId)) {
      return res.status(400).json({
        message: "documentId không hợp lệ.",
      });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Không tìm thấy tài liệu.",
      });
    }

    if (!isOwner(document, userId)) {
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
      message: error.message || "Lỗi server khi xóa tài liệu.",
    });
  }
});

module.exports = router;
