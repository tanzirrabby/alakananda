const router = require('express').Router();
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/validate', protect, async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'কুপন কোড সঠিক নয়' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'কুপনের মেয়াদ শেষ' });
    if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ message: 'কুপন ব্যবহারের সীমা শেষ' });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ message: `ন্যূনতম অর্ডার ৳${coupon.minOrder} হতে হবে` });
    
    const discount = coupon.discountType === 'percent'
      ? Math.round(orderTotal * coupon.discountValue / 100)
      : coupon.discountValue;
    res.json({ valid: true, discount, coupon });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', protect, adminOnly, async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
});

module.exports = router;
