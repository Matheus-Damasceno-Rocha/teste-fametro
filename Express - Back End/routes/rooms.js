const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Equipment = require('../models/Equipment');
const { protect, authorize } = require('../middleware/auth');


// Create room (coord)
router.post('/', protect, authorize('coord'), async (req, res) => {
const room = new Room(req.body);
await room.save();
res.status(201).json(room);
});


// List rooms (public)
router.get('/', async (req, res) => {
const rooms = await Room.find().populate('equipments');
res.json(rooms);
});


// Update room
router.put('/:id', protect, authorize('coord'), async (req, res) => {
const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(room);
});


module.exports = router;