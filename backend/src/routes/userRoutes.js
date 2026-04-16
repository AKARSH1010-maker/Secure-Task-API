const express = require("express");
const { getAllUsers } = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;