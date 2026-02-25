const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/dashboard', async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email')
    ]);

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });

    res.json({
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: revenue[0]?.total || 0,
        pendingOrders
      },
      recentOrders: orders
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('user', 'name email phone');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    ).populate('user', 'name email');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    const customersWithStats = await Promise.all(customers.map(async (c) => {
      const orderCount = await Order.countDocuments({ user: c._id });
      const cartData = await Cart.findOne({ user: c._id });
      return {
        ...c.toObject(),
        orderCount,
        cartItemCount: cartData?.items?.length || 0
      };
    }));
    res.json(customersWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
