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
  status: { type:String, enum:['pending','free','paid','processing','emailed','failed'], default:'pending' },
  razorpay: { orderId:String, paymentId:String, signature:String },
  pdfKey: String,
  pdfUrl: String,
}, { timestamps:true });
export default mongoose.model('Order', OrderSchema);
