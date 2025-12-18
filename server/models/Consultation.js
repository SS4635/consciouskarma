import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema(
  {
    formData: { type: Object, required: true },
    name: { type: String },
    email: { type: String, index: true },
    phone: { type: String },
    status: { type: String, default: 'new' },
    planName: { type: String },
    price: { type: String },

  },
  { timestamps: true }
);

export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
