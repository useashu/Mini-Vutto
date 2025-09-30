const express = require('express');
const { body, validationResult } = require('express-validator');
const Bike = require('../models/bike');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /bikes/mine (authenticated, my listings)
// Important: This route must be defined BEFORE the /:id route to avoid conflicts
router.get('/mine', auth, async (req, res) => {
  try {
    const bikes = await Bike.getBySeller(req.user.id);
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /bikes (with optional search)
router.get('/', async (req, res) => {
  try {
    const { brand, model } = req.query;
    const bikes = await Bike.getAll({ brand, model });
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /bikes/:id
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.getById(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /bikes (authenticated)
router.post(
  '/',
  auth,
  [
    body('brand').notEmpty(),
    body('model').notEmpty(),
    body('year').isInt({ min: 1900 }),
    body('price').isNumeric(),
    body('kilometers_driven').isInt({ min: 0 }),
    body('location').notEmpty(),
    body('image_url').optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const bike = await Bike.create({ ...req.body, seller_id: req.user.id });
      res.status(201).json(bike);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// PUT /bikes/:id (authenticated, owner only)
router.put(
  '/:id',
  auth,
  [
    body('brand').notEmpty(),
    body('model').notEmpty(),
    body('year').isInt({ min: 1900 }),
    body('price').isNumeric(),
    body('kilometers_driven').isInt({ min: 0 }),
    body('location').notEmpty(),
    body('image_url').optional().isURL(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const bike = await Bike.getById(req.params.id);
      if (!bike) return res.status(404).json({ error: 'Bike not found' });
      if (bike.seller_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
      const updated = await Bike.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// DELETE /bikes/:id (authenticated, owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const bike = await Bike.getById(req.params.id);
    if (!bike) return res.status(404).json({ error: 'Bike not found' });
    if (bike.seller_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    await Bike.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Note: We moved this route to before the /:id route

module.exports = router;
