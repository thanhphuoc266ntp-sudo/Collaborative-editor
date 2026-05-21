const express = require("express");
const Folder = require("../models/Folder");
const Document = require("../models/Document");
const auth = require("../middleWare/auth");

const router = express.Router();

const DEFAULT_FOLDERS = [
  {
    id: "all",
    name: "Tất cả tài liệu",
    icon: "📁",
    description: "Xem toàn bộ tài liệu của bạn",
    isDefault: true,
  },
  {
    id: "web-project",
    name: "Công việc",
    icon: "💼",
    description: "Tài liệu liên quan đến công việc và dự án",
    isDefault: true,
  },
  {
    id: "crypto",
    name: "Học tập",
    icon: "🎓",
    description: "Tài liệu học tập, bài tập và nghiên cứu",
    isDefault: true,
  },
  {
    id: "notes",
    name: "Ghi chú",
    icon: "📝",
    description: "Ghi chú cá nhân và ý tưởng",
    isDefault: true,
  },
];

const getUserId = (req) => {
  return req.user?.id || req.user?._id || req.user?.userId || null;
};

const normalizeFolderName = (name) => {
  return String(name || "").trim();
};

const createFolderId = (name) => {
  const slug = String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `custom-${slug || Date.now()}`;
};

const normalizeFolderId = (folderId) => {
  const value = String(folderId || "").trim();

  if (!value) return "";

  const isSafeFolderId = /^[a-zA-Z0-9_-]{1,80}$/.test(value);

  if (!isSafeFolderId) return "";

  return value;
};

router.get("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    const customFolders = await Folder.find({
      owner: userId,
    }).sort({
      createdAt: 1,
    });

    const folders = [
      ...DEFAULT_FOLDERS,
      ...customFolders.map((folder) => ({
        id: folder.folderId,
        name: folder.name,
        icon: folder.icon || "📁",
        description: folder.description || "Thư mục tùy chỉnh",
        isDefault: false,
      })),
    ];

    return res.json({
      folders,
    });
  } catch (error) {
    console.error("Get folders error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi lấy danh sách thư mục.",
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    const folderName = normalizeFolderName(name);

    if (!folderName) {
      return res.status(400).json({
        message: "Vui lòng nhập tên thư mục.",
      });
    }

    const existedDefaultFolder = DEFAULT_FOLDERS.some((folder) => {
      return folder.name.toLowerCase() === folderName.toLowerCase();
    });

    if (existedDefaultFolder) {
      return res.status(400).json({
        message: "Tên thư mục này đã tồn tại.",
      });
    }

    const existedCustomFolder = await Folder.findOne({
      owner: userId,
      name: {
        $regex: `^${folderName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    });

    if (existedCustomFolder) {
      return res.status(400).json({
        message: "Tên thư mục này đã tồn tại.",
      });
    }

    let folderId = createFolderId(folderName);

    const existedFolderId = await Folder.findOne({
      owner: userId,
      folderId,
    });

    if (existedFolderId) {
      folderId = `${folderId}-${Date.now()}`;
    }

    const folder = await Folder.create({
      name: folderName,
      folderId,
      owner: userId,
      icon: "📁",
      description: "Thư mục tùy chỉnh",
      isDefault: false,
    });

    return res.status(201).json({
      message: "Tạo thư mục thành công.",
      folder: {
        id: folder.folderId,
        name: folder.name,
        icon: folder.icon,
        description: folder.description,
        isDefault: false,
      },
    });
  } catch (error) {
    console.error("Create folder error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi tạo thư mục.",
    });
  }
});

router.delete("/:folderId", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const folderId = normalizeFolderId(req.params.folderId);

    if (!userId) {
      return res.status(401).json({
        message: "Không xác định được người dùng.",
      });
    }

    if (!folderId) {
      return res.status(400).json({
        message: "folderId không hợp lệ.",
      });
    }

    const isDefaultFolder = DEFAULT_FOLDERS.some((folder) => {
      return folder.id === folderId;
    });

    if (isDefaultFolder) {
      return res.status(400).json({
        message: "Không thể xóa thư mục mặc định.",
      });
    }

    const folder = await Folder.findOne({
      owner: userId,
      folderId,
    });

    if (!folder) {
      return res.status(404).json({
        message: "Không tìm thấy thư mục.",
      });
    }

    const hasDocuments = await Document.exists({
      owner: userId,
      folderId,
    });

    if (hasDocuments) {
      return res.status(400).json({
        message:
          "Thư mục này đang có tài liệu. Hãy chuyển tài liệu sang thư mục khác trước khi xóa.",
      });
    }

    await Folder.deleteOne({
      owner: userId,
      folderId,
    });

    return res.json({
      message: "Xóa thư mục thành công.",
    });
  } catch (error) {
    console.error("Delete folder error:", error);

    return res.status(500).json({
      message: error.message || "Lỗi server khi xóa thư mục.",
    });
  }
});

module.exports = router;
