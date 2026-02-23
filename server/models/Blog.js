import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  // 🔥 Ye 2 nayi fields add karni hain
  category: { type: String, default: "Uncategorized" },
  keywords: { type: [String], default: [] }, 
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);