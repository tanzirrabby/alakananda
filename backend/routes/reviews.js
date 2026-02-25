const router = require('express').Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });
    product.reviews.push({ user: req.user._id, name: req.user.name, photo: req.user.photo, rating, comment });
    product.updateRating();
    await product.save();
    res.status(201).json({ message: 'Review added', avgRating: product.avgRating });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
