import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema(
  {
    formData: { type: Object, required: true },

    // 🔥 denormalised for easy access
    name: { type: String, index: true },
    email: { type: String, index: true },
    phone: { type: String },

    planName: { type: String },
    price: { type: Number },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    // ✅ FIX: Dashboard status ke liye ye field add karna zaroori hai
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Consultation ||
  mongoose.model("Consultation", ConsultationSchema);