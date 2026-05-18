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

documentSchema.pre("save", function (next) {
  if (!this.documentId) {
    this.documentId = Math.random().toString(36).substring(2, 10);
  }
  next();
});

module.exports = mongoose.model("Document", documentSchema);
