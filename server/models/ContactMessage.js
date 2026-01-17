import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    page: { type: String, default: "Contact Us" },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", ContactMessageSchema);
