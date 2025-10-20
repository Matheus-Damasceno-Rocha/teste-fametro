const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// login
router.post('/login', async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
res.json({ token, user: { id: user._id, email: user.email, role: user.role, name: user.name } });
});

module.exports = router;