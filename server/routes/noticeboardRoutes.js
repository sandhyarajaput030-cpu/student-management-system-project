import express from "express";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";
import {
  getNotices,
  addNotice,
  deleteNotice
} from "../controller/NoticeboardController.js";

const router = express.Router();

/* ===============================
   STUDENT ROUTE (VIEW ONLY)
   =============================== */

// Approved students can view notices
router.get("/student", verifyToken, getNotices);


/* ===============================
   ADMIN ROUTES
   =============================== */

// Admin can view all notices
router.get("/admin", verifyToken, isAdmin, getNotices);

// Admin can add notice
router.post("/", verifyToken, isAdmin, addNotice);

// Admin can delete notice
router.delete("/:id", verifyToken, isAdmin, deleteNotice);

export default router;