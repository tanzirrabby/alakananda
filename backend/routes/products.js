const router = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public routes
router.get('/', async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { isAvailable: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    
    let sortOpt = { createdAt: -1 };
    if (sort === 'price-asc') sortOpt = { price: 1 };
    if (sort === 'price-desc') sortOpt = { price: -1 };

    const products = await Product.find(query).sort(sortOpt);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isAvailable: true }).limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files?.map(f => `/uploads/${f.filename}`) || [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.length > 0) updates.images = req.files.map(f => `/uploads/${f.filename}`);
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
