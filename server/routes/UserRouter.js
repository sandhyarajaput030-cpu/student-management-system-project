import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  changePassword,
  updateAdminProfile,
  getDashboardData,
  approveStudent,
  rejectStudent,
  getAdminProfile
} from "../controller/UserController.js";

// Student controllers
import {
  getAllStudents,
  updateStudentDetails,
  getStudentDashboard
} from "../controller/StudentController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();


// ================= PUBLIC ROUTES =================

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);


// ================= ADMIN PROFILE =================

router.get("/admin-profile", verifyToken, isAdmin, getAdminProfile);
router.put("/profile", verifyToken, isAdmin, updateAdminProfile);


// ================= ADMIN DASHBOARD =================

router.get("/admin-dashboard", verifyToken, isAdmin, getDashboardData);


// ================= STUDENT DASHBOARD =================

router.get("/dashboard", verifyToken, getStudentDashboard);


// ================= STUDENT APPROVAL =================

router.patch("/student/:id/approve", verifyToken, isAdmin, approveStudent);
router.delete("/student/:id/reject", verifyToken, isAdmin, rejectStudent);


// ================= STUDENT MANAGEMENT =================

// Get all students
router.get("/all-students", verifyToken, isAdmin, getAllStudents);

// Update student details
router.patch(
  "/student/:id/update-details",
  verifyToken,
  isAdmin,
  updateStudentDetails
);

export default router;