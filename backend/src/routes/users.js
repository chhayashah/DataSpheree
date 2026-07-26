const express = require("express");
const router = express.Router();
const {
  listUsers,
  getUser,
  inviteUser,
  updateUser,
  changeUserRole,
  setUserStatus,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { PERMISSIONS } = require("../constants");

router.use(protect, authorize(PERMISSIONS.USER_MANAGE));

router.get("/", listUsers);
router.post("/", inviteUser);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.patch("/:id/role", changeUserRole);
router.patch("/:id/status", setUserStatus);

module.exports = router;
