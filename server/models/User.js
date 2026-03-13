import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student"
  },

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  },

  course: {
    type: String,
    required: true
  },

  contactNumber: {
    type: String,
    required: true
  },

  yearOfStudy: {
    type: String,
    required: true
  },

  // ================= ATTENDANCE =================
  attendance: [
    {
      days: {
        type: Object,
        default: {}
      },
      attendancePercent: {
        type: Number,
        default: 0
      }
    }
  ],

  // ================= FEE =================
  fee: {
    total: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    }
  },

  // ================= EXAMS =================
  exams: [
    {
      subject: String,
      date: String,
      time: String
    }
  ],

  // ================= EVENTS =================
  events: [
    {
      title: String,
      description: String,
      date: String,
      time: String
    }
  ]

},
{
  timestamps: true
}
);

const User = mongoose.model("User", userSchema);

export default User;