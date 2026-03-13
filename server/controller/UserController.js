import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


// ================= EMAIL HELPER =================
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Student Management" <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully ✅");
  } catch (error) {
    console.log("EMAIL ERROR ❌:", error.message);
  }
};



// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      contactNumber,
      course,
      yearOfStudy
    } = req.body;

    // validation
    if (!name || !email || !password || !course) {
      return res.status(400).json({
        success: false,
        message: "All fields required ❌"
      });
    }

    email = email.toLowerCase().trim();

    // check existing
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered ❌"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // force correct role
    const userRole = role === "admin" ? "admin" : "student";

    // force correct status
    const userStatus = userRole === "admin" ? "approved" : "pending";

    // create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      status: userStatus,
      contactNumber: contactNumber || "",
      course: course || "Not assigned",
      yearOfStudy: yearOfStudy || ""
    });

    console.log("Saved user:", newUser);

    // send email
    const html = `
      <h2>Welcome ${name} 🎉</h2>
      <p>Course: ${newUser.course}</p>
      <p>Status: ${newUser.status}</p>
    `;

    await sendEmail(email, "Registration Successful 🎓", html);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: newUser
    });

  } catch (error) {

    console.log("REGISTER ERROR ❌:", error.message);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};




// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // 1️⃣ Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    email = email.toLowerCase().trim();

    // 2️⃣ Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 3️⃣ Check password FIRST
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // 4️⃣ Check approval ONLY for students
    if (
      user.role === "student" &&
      user.status &&
      user.status.trim().toLowerCase() !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: "Wait for admin approval"
      });
    }

    // 5️⃣ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "90d"
      }
    );

    // 6️⃣ Send success response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        status: user.status
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR ❌:", error);
    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};


// ================= DASHBOARD =================
export const getDashboardData = async (req, res) => {

  try {

    const students = await User.find({
      role: "student"
    });

    const totalStudents = students.length;

    const pendingStudents = students.filter(
      student => student.status === "pending"
    ).length;

    const approvedStudents = students.filter(
      student => student.status === "approved"
    ).length;


    const recentStudents = await User.find({
      role: "student"
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("name email course status");


    res.json({
      success: true,
      totalStudents,
      pendingStudents,
      approvedStudents,
      recentStudents
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Dashboard error"
    });
  }
};




// ================= APPROVE STUDENT =================
export const approveStudent = async (req, res) => {

  try {

    const studentId = req.params.id;

    console.log("Approving ID:", studentId);

    const student = await User.findById(studentId);

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    student.status = "approved";

    await student.save();

    res.json({
      success: true,
      message: "Student approved successfully",
      student
    });

  } catch (error) {

    console.log("Approve error:", error);

    res.status(500).json({
      success: false,
      message: "Error approving student"
    });
  }
};



// ================= REJECT STUDENT =================
export const rejectStudent = async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student rejected and deleted"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error rejecting student"
    });
  }
};




// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {

  try {

    let { email } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const tempPassword = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.password = await bcrypt.hash(tempPassword, 10);

    await user.save();

    await sendEmail(
      email,
      "Temporary Password",
      `<h2>${tempPassword}</h2>`
    );

    res.json({
      success: true,
      message: "Temporary password sent"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error sending password"
    });
  }
};




// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {

  try {

    let { email, oldPassword, newPassword } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    const match = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!match) {

      return res.status(400).json({
        success: false,
        message: "Wrong password"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error changing password"
    });
  }
};




// Get Admin Profile (no token)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // normalize contact field for frontend which expects `contact`
    const adminObj = admin.toObject ? admin.toObject() : { ...admin };
    adminObj.contact = adminObj.contact || adminObj.contactNumber || "";

    res.json(adminObj);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile (no token)
export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, email, contact, password } = req.body;

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    // persist into model field `contactNumber` while accepting `contact` from frontend
    admin.contactNumber = contact || admin.contactNumber || "";

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      contact: admin.contactNumber || "",
      role: admin.role
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
};


// ================= STUDENT DASHBOARD =================
export const getStudentDashboard = async (req, res) => {
  try {

    const student = await User.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      name: student.name,
      attendance: student.attendance || [],
      fee: student.fee || { total: 0, paid: 0 },
      exams: student.exams || [],
      events: student.events || []
    });

  } catch (error) {

    console.log("STUDENT DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error loading dashboard"
    });

  }
};


