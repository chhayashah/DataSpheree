const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadCSV,
  getRecords,
  getRecordById,
} = require("../controllers/dataController");
const { protect } = require("../middleware/auth");
const { FILE_LIMITS } = require("../constants");

// Multer — memory mein file rakho (disk pe nahi)
const upload = multer({
  storage: multer.memoryStorage(),
  //   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  limits: { fileSize: FILE_LIMITS.MAX_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files allowed"), false);
    }
  },
});

// Saari routes protected hain — login zaroori
router.post("/upload", protect, upload.single("file"), uploadCSV);
router.get("/", protect, getRecords);
router.get("/:id", protect, getRecordById);

module.exports = router;
