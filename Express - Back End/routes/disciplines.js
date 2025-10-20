const express = require('express');
const router = express.Router();
const Discipline = require('../models/Discipline');
const { protect, authorize } = require('../middleware/auth');


router.post('/', protect, authorize('coord'), async (req, res) => {
const d = new Discipline(req.body);
await d.save();
res.status(201).json(d);
});


router.get('/', protect, async (req, res) => {
const list = await Discipline.find().populate('professor', 'name email');
res.json(list);
});


module.exports = router;