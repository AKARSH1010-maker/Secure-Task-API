const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const protect = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

router.use(protect);

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority")
  ],
  validate,
  createTask
);

router.get("/", getTasks);
router.get("/:id", getTaskById);

router.patch(
  "/:id",
  [
    body("status")
      .optional()
      .isIn(["pending", "in-progress", "completed"])
      .withMessage("Invalid status"),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Invalid priority")
  ],
  validate,
  updateTask
);

router.delete("/:id", deleteTask);

module.exports = router;