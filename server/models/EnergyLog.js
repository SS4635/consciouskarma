import mongoose from "mongoose";

const energyLogSchema = new mongoose.Schema({
  mobileNumber: { type: String, required: true },
  routeHit: { type: String, required: true }, 
  sourceLink: { type: String, required: true }, 
  // ✅ New Field: Stores the actual API response data
  responseData: { type: Object, default: null }, 
  ipAddress: { type: String, default: "0.0.0.0" },
  userAgent: { type: String }, 
}, { timestamps: true });

// Indexing for faster lookups when checking for existing numbers
energyLogSchema.index({ mobileNumber: 1, routeHit: 1 });

export default mongoose.model("EnergyLog", energyLogSchema);