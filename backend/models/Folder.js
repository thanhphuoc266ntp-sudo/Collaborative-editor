const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    folderId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    icon: {
      type: String,
      default: "📁",
    },

    description: {
      type: String,
      default: "Thư mục tùy chỉnh",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

folderSchema.index(
  {
    owner: 1,
    folderId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Folder", folderSchema);
