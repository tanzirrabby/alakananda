const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, price: Number, quantity: Number,
    image: String, selectedSize: String, selectedColor: String
  }],
  totalAmount: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  couponCode: { type: String },
  couponDiscount: { type: Number, default: 0 },
  shippingAddress: {
    name: String, phone: String, address: String, city: String, district: String
  },
  paymentMethod: { type: String, enum: ['bkash', 'nagad', 'card', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { type: String, enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'placed' },
  transactionId: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
