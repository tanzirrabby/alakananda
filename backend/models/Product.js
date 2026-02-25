const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { 
    type: String, 
    enum: ['set-combo', 'metal-dhatu', 'shuta-kapor'],
    required: true 
  },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  sizes: [{ type: String }],
  colors: [{ type: String }],
  material: { type: String },
  isFeatured: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
