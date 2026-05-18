const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Tài liệu không tên",
    },

    documentId: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 10),
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    folderId: {
      type: String,
      default: "root",
    },

    content: {
      type: String,
      default: "",
    },

    yState: {
      type: Buffer,
      default: null,
    },

    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor"],
          default: "editor",
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
