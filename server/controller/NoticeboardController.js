import Notice from "../models/Notice.js";

// ===================== GET NOTICES =====================
// For both admin and approved students
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ createdAt: -1 });
    res.status(200).json(notices);
  } catch (err) {
    console.error("getNotices error:", err);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
};

// ===================== ADD NOTICE =====================
// Admin only
export const addNotice = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Notice text is required" });
    }

    const processedText = text.trim();
    // generate a short title from the first line / first 100 chars of the text
    const title = (processedText.split("\n")[0] || "").slice(0, 100) || "Notice";

    const notice = await Notice.create({
      title,
      text: processedText,
      createdBy: req.user?._id, // req.user comes from middleware
    });

    res.status(201).json(notice);
  } catch (err) {
    console.error("addNotice error:", err);
    res.status(500).json({ message: "Failed to add notice" });
  }
};

// ===================== DELETE NOTICE =====================
// Admin only
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    await notice.deleteOne();
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (err) {
    console.error("deleteNotice error:", err);
    res.status(500).json({ message: "Failed to delete notice" });
  }
};