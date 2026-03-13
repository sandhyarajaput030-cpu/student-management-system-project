import express from "express";
import {
  changeStudentPassword,
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  addAttendance,
  addExam,
  addEvent,
  updateFee,
  updateStudentDetails, // ✅ import the admin update function
  getAllStudents // ✅ import admin GET all students
} from "../controller/StudentController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

// Middleware to ensure students can only modify their own data
const isSelf = (req, res, next) => {
  if (req.user.role === "student" && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Forbidden: Cannot modify other student data" });
  }
  next();
};

const StudentRoutes = express.Router();

// ================= STUDENT PROFILE =================
// GET profile
StudentRoutes.get("/profile", verifyToken, getStudentProfile);
// PUT profile
StudentRoutes.put("/profile", verifyToken, updateStudentProfile);

// ================= PASSWORD =================
// POST change password
StudentRoutes.post("/change-password", verifyToken, changeStudentPassword);

// ================= DASHBOARD =================

// GET student dashboard
// Protected route
StudentRoutes.get("/dashboard", verifyToken, getStudentDashboard);

// ================= STUDENT ACTIONS =================

// POST add attendance for a student
// Protected route
StudentRoutes.post("/:id/attendance", verifyToken, isSelf, addAttendance);

// POST add exam record for a student
// Protected route
StudentRoutes.post("/:id/exams", verifyToken, isSelf, addExam);

// POST add event for a student
// Protected route
StudentRoutes.post("/:id/events", verifyToken, isSelf, addEvent);

// PUT update fee for a student
// Protected route
StudentRoutes.put("/:id/fee", verifyToken, isSelf, updateFee);

// ================= ADMIN ONLY =================
// GET all students
StudentRoutes.get("/all-students", verifyToken, isAdmin, getAllStudents);

// PATCH update any student details (attendance, exams, events, fee, status)
StudentRoutes.patch("/student/:id/update-details", verifyToken, isAdmin, updateStudentDetails);


export default StudentRoutes;