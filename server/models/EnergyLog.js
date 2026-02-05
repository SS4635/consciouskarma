import mongoose from "mongoose";

const energyLogSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  routeHit: { type: String, required: true }, // e.g., 'a1', 'b2'
  ipAddress: { type: String, default: "0.0.0.0" },
  userAgent: { type: String }, // Device info
}, { timestamps: true });

export default mongoose.model("EnergyLog", energyLogSchema);