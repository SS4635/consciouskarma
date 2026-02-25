import mongoose from "mongoose";

const energyLogSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  routeHit: { type: String, required: true }, // The actual API route hit (e.g., a1, a2)
  sourceLink: { type: String, required: true }, // The key used in the URL (e.g., abc, pqr)
  ipAddress: { type: String, default: "0.0.0.0" },
  userAgent: { type: String }, 
}, { timestamps: true });

export default mongoose.model("EnergyLog", energyLogSchema);