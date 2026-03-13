import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["General", "Exam", "Holiday", "Important"],
      default: "General"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }

  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);