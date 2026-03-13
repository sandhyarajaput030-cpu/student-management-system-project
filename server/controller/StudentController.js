import User from '../models/User.js'; // use User model (users collection holds students)
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// -------------------- GET STUDENT PROFILE --------------------
// GET /api/student/profile
export const getStudentProfile = async (req, res) => {
  try {
    const auth = req.headers?.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = auth.split(' ')[1];
    let studentId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      studentId = decoded.id;
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(studentId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully ✅',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contactNumber || user.phone || '',
        role: user.role,
        course: user.course || ''
      }
    });
  } catch (error) {
    console.error('getStudentProfile error:', error);
    res.status(500).json({ message: 'Failed to get profile ❌', error: error.message });
  }
};

// -------------------- UPDATE STUDENT PROFILE --------------------
// PUT /api/student/profile
export const updateStudentProfile = async (req, res) => {
  try {
    const auth = req.headers?.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = auth.split(' ')[1];
    let studentId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      studentId = decoded.id;
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const { name, email, contact } = req.body;

    if (!name || !email || !contact) {
      return res.status(400).json({ message: 'Name, email and contact are required' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if email is being changed
    if (email !== student.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: studentId } });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
    }

    // Update student (map contact -> contactNumber)
    student.name = name;
    student.email = email;
    student.contactNumber = contact;
    await student.save();

    res.status(200).json({
      message: 'Profile updated successfully ✅',
      user: {
        _id: student._id,
        name: student.name,
        email: student.email,
        contact: student.contactNumber || '',
        role: student.role,
        course: student.course || ''
      }
    });
  } catch (error) {
    console.error('updateStudentProfile error:', error);
    res.status(500).json({ message: 'Failed to update profile ❌', error: error.message });
  }
};



// ================= CHANGE STUDENT PASSWORD =================
// POST /api/student/change-password

export const changeStudentPassword = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required"
      });
    }

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect"
      });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    res.status(200).json({
      message: "Password changed successfully ✅"
    });

  } catch (error) {
    console.error("changeStudentPassword error:", error);
    res.status(500).json({
      message: "Failed to change password ❌"
    });
  }
};

// ================= GET ALL STUDENTS =================
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, students });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
};

// ================= UPDATE STUDENT DETAILS =================
export const updateStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { attendance, fee, exams, events, status } = req.body;

    const updateData = {};

    if (attendance) {
      const presentCount = Object.values(attendance).filter(v => v === "P").length;
      const percent = Math.round((presentCount / 30) * 100);

      updateData.attendance = [
        {
          days: attendance,
          attendancePercent: percent
        }
      ];
    }

    if (fee) updateData.fee = fee;
    if (exams) updateData.exams = exams;
    if (events) updateData.events = events;
    if (status) updateData.status = status;

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      updateData,
      { returnDocument: "after" }   // ✅ updated option
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student"
    });
  }
};
// ================= ADD/UPDATE ATTENDANCE =================
export const addAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendance } = req.body; // attendance: { day: "present" }

    const student = await User.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Merge old attendance with new
    const oldAttendance = student.attendance[0]?.days || {};
    const mergedAttendance = { ...oldAttendance, ...attendance };

    // Calculate attendance percentage
    const presentCount = Object.values(mergedAttendance).filter(v => v === "P").length;
    const attendancePercent = Math.round((presentCount / 30) * 100);

    // Save as array with one object (matches frontend)
    student.attendance = [{ days: mergedAttendance, attendancePercent }];

    await student.save();

    res.json({
      success: true,
      message: "Attendance updated successfully",
      student
    });

  } catch (error) {
    console.error("ADD ATTENDANCE ERROR:", error);
    res.status(500).json({ message: "Error updating attendance" });
  }
};

// ================= UPDATE FEE =================
export const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalFee, paidFee } = req.body;

    const student = await User.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.fee = { total: totalFee, paid: paidFee };
    await student.save();

    res.json({ success: true, message: "Fee updated successfully", student });
  } catch (error) {
    console.error("UPDATE FEE ERROR:", error);
    res.status(500).json({ message: "Error updating fee" });
  }
};

// ================= ADD EXAM =================
export const addExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, date, time } = req.body;

    const student = await User.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.exams.push({ subject, date, time });
    await student.save();

    res.json({ success: true, message: "Exam added successfully", student });
  } catch (error) {
    console.error("ADD EXAM ERROR:", error);
    res.status(500).json({ message: "Error adding exam" });
  }
};

// ================= ADD EVENT =================
export const addEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time } = req.body;

    const student = await User.findById(id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.events.push({ title, description, date, time });
    await student.save();

    res.json({ success: true, message: "Event added successfully", student });
  } catch (error) {
    console.error("ADD EVENT ERROR:", error);
    res.status(500).json({ message: "Error adding event" });
  }
};

// ---------------- GET STUDENT DASHBOARD ----------------
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const student = await User.findById(studentId).select('-password');

    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.role !== 'student') return res.status(403).json({ message: 'Only students can access this dashboard' });
    if (student.status !== 'approved') return res.status(403).json({ message: 'Your account is not approved by admin yet' });

    // === Attendance ===
    const attendanceDays = student.attendance[0]?.days || {}; // P/A exactly as stored
    const attendancePercent = student.attendance[0]?.attendancePercent || 0;

    // === Other Data ===
    const fee = student.fee || { total: 0, paid: 0 };
    const exams = student.exams || [];
    const events = student.events || [];

    // === Response ===
    res.status(200).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      attendance: attendanceDays,      // send P/A map
      attendancePercent,               // number
      fee,
      exams,
      events,
    });

  } catch (error) {
    console.error('DASHBOARD ERROR:', error);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};