const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');


router.get('/', protect, async (req, res) => {
const notes = await Notification.find({ user: req.user._id }).sort('-createdAt');
res.json(notes);
});


module.exports = router;