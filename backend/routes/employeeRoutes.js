const express = require("express");

const {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  stats
} = require("../controllers/employeeController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listEmployees);
router.get("/stats", stats);
router.get("/:id", getEmployee);

router.post("/", requireRole("ADMIN"), createEmployee);
router.put("/:id", requireRole("ADMIN"), updateEmployee);
router.delete("/:id", requireRole("ADMIN"), deleteEmployee);

module.exports = router;

