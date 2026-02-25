const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Coupon', couponSchema);
