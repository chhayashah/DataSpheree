const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "login",
        "logout",
        "upload",
        "view",
        "download",
        "delete",
        "invite",
        "role_change",
        "suspend",
        "activate",
        "update",
      ],
      required: true,
    },
    relatedRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataRecord",
      default: null,
    },
    details: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserActivity", userActivitySchema);
