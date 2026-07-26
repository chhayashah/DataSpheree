const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "upload_processed",
        "role_change",
        "suspended",
        "activated",
        "invited",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DataRecord",
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

NotificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
