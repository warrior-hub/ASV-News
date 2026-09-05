const express = require("express");

const router = express.Router();

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const upload = require("../middleware/upload");

router.post(
  "/",
  upload.single("profileImage"),
  createEmployee
);

router.get(
  "/",
  getAllEmployees
);

router.get(
  "/:id",
  getEmployeeById
);

router.put(
  "/:id",
  upload.single("profileImage"),
  updateEmployee
);

router.delete(
  "/:id",
  deleteEmployee
);

module.exports = router;

