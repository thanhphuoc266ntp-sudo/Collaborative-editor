const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
    },
  },
  {
    _id: false,
  },
);

const shareLinkSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["viewer", "editor"],
      default: "viewer",
    },
  },
  {
    _id: false,
  },
);

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Tài liệu không tên",
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },

    folderId: {
      type: String,
      enum: ["web-project", "crypto", "notes"],
      default: "web-project",
      index: true,
    },

    shareLink: {
      type: shareLinkSchema,
      default: () => ({
        enabled: false,
        role: "viewer",
      }),
    },

    yState: {
      type: Buffer,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Document", documentSchema);
