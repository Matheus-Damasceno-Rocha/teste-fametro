const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');


// Coord: create user
router.post('/', protect, authorize('coord'), async (req, res) => {
const { name, email, password, role } = req.body;
let user = await User.findOne({ email });
if (user) return res.status(400).json({ msg: 'Email exists' });
const hash = await bcrypt.hash(password || 'changeme', 10);
user = new User({ name, email, password: hash, role });
await user.save();
res.status(201).json(user);
});


// Edit user (coord)
router.put('/:id', protect, authorize('coord'), async (req, res) => {
const updates = req.body;
if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);
const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
res.json(user);
});


// List users (coord)
router.get('/', protect, authorize('coord'), async (req, res) => {
const users = await User.find().select('-password');
res.json(users);
});


module.exports = router;