const router = require('express').Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes, couponCode, shippingCost } = req.body;
    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        couponDiscount = coupon.discountType === 'percent'
          ? Math.round(itemTotal * coupon.discountValue / 100)
          : coupon.discountValue;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const totalAmount = itemTotal - couponDiscount + (shippingCost || 0);
    const order = await Order.create({
      user: req.user._id, items, totalAmount, shippingCost: shippingCost || 0,
      couponCode, couponDiscount, shippingAddress, paymentMethod, notes
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
