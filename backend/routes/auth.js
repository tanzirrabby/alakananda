const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'alakananda_secret', { expiresIn: '30d' });

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(400).json({ message: 'Invalid email or password' });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Google login
router.post('/google', async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: Math.random().toString(36), photo: photoURL, isGoogleUser: true });
    } else {
      user.photo = photoURL;
      await user.save();
    }
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/me', protect, async (req, res) => { res.json(req.user); });

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, address }, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
