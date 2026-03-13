import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/UserRouter.js";
import noticeboardRoutes from "./routes/noticeboardRoutes.js";
import studentRoutes from "./routes/StudentRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// ----- ROUTES -----
app.use("/api/users", userRouter);
app.use("/api/noticeboard", noticeboardRoutes);
app.use("/api/student", studentRoutes);

// ----- DATABASE -----
mongoose.connect(process.env.MONGOURL)
  .then(() => console.log("DB Connected Successfully ✅"))
  .catch(err => console.log("DB Connection Error:", err));

// ----- SERVER -----
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));