import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,                 // paise
  currency: { type:String, default:'INR' },
  couponCode: String,
  couponRedeemed: { type:Boolean, default:false },
  couponRedeemResponse: {},       // optional raw partner response
  accountChoice: { type:String, enum:['guest','create'], default:'guest' },
  
  status: { 
    type: String, 
    enum: ['pending', 'free', 'paid', 'processing', 'emailed', 'failed', 'submitted'], 
    default: 'pending' 
  },

  razorpay: { orderId:String, paymentId:String, signature:String },
  
  formData: { type: Object }, 

  pdfKey: String,
  pdfUrl: String,

  // ✅ FIX: Dono email tracking fields add karni padengi
  emailSent: { type: Boolean, default: false }, // For Personalised
  instantEmailSent: { type: mongoose.Schema.Types.Mixed, default: false } // For Instant (Takes "processing" or true)

}, { timestamps:true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);