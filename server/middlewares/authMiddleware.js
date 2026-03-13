import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ================= VERIFY TOKEN =================
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check student approval
    if (user.role === "student" && user.status !== "approved") {
      return res.status(403).json({
        message: "Account pending admin approval"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ================= ADMIN CHECK =================
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }
};