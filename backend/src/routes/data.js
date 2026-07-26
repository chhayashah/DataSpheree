const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadCSV,
  getRecords,
  getRecordById,
  deleteRecord,
  bulkDeleteRecords,
} = require("../controllers/dataController");
const { protect, authorize } = require("../middleware/auth");
const { FILE_LIMITS, PERMISSIONS } = require("../constants");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FILE_LIMITS.MAX_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files allowed"), false);
    }
  },
});

router.post(
  "/upload",
  protect,
  authorize(PERMISSIONS.DATA_UPLOAD),
  upload.single("file"),
  uploadCSV,
);
router.get("/", protect, getRecords);
router.delete(
  "/",
  protect,
  authorize(PERMISSIONS.DATA_MANAGE),
  bulkDeleteRecords,
);
router.get("/:id", protect, getRecordById);
router.delete(
  "/:id",
  protect,
  authorize(PERMISSIONS.DATA_MANAGE),
  deleteRecord,
);

module.exports = router;
