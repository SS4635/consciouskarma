// models/Blog.js
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // URL ke liye
  content: { type: String, required: true }, // HTML content from editor
  imageUrl: { type: String, required: true }, // Local server image path
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);