const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user.wishlist);
});

router.post('/toggle/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  const pId = req.params.productId;
  const idx = user.wishlist.findIndex(id => id.toString() === pId);
  if (idx > -1) { user.wishlist.splice(idx, 1); }
  else { user.wishlist.push(pId); }
  await user.save();
  res.json({ wishlisted: idx === -1, wishlist: user.wishlist });
});

module.exports = router;
