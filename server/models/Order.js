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
  
  // ✅ FIX: Added 'submitted' to the enum list below
  status: { 
    type: String, 
    enum: ['pending', 'free', 'paid', 'processing', 'emailed', 'failed', 'submitted'], 
    default: 'pending' 
  },

  razorpay: { orderId:String, paymentId:String, signature:String },
  
  // Isme ek aur cheez: Kabhi kabhi hum formData bhi save kar rahe hain backend me
  // par schema me defined nahi hai. Mongoose strict mode me usse ignore kar dega (save nahi karega).
  // Agar tum chahte ho ki formData save ho (jo reports ke liye zaroori hai), 
  // toh usse bhi yahan define karna padega:
  formData: { type: Object }, // ✅ Added to ensure form data is saved

  pdfKey: String,
  pdfUrl: String,
}, { timestamps:true });

export default mongoose.model('Order', OrderSchema);