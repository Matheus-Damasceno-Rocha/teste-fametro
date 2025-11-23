const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { protect, authorize } = require('../middleware/auth');


router.post('/', protect, authorize('coord'), async (req, res) => {
const eq = new Equipment(req.body);
await eq.save();
res.status(201).json(eq);
});


router.get('/', async (req, res) => {
const items = await Equipment.find();
res.json(items);
});


module.exports = router;