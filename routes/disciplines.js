const express = require('express');
const router = express.Router();
const Discipline = require('../models/Discipline');
const { protect, authorize } = require('../middleware/auth');


router.post('/', protect, authorize('coord'), async (req, res) => {
const d = new Discipline(req.body);
await d.save();
res.status(201).json(d);
});


// List disciplines (public - visitantes podem ver)
router.get('/', async (req, res) => {
try {
const list = await Discipline.find().populate('professor', 'name email');
res.json(list);
} catch (error) {
res.status(500).json({ message: 'Erro ao buscar disciplinas' });
}
});


module.exports = router;