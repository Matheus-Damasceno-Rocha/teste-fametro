const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// Create reservation (professor or coord)
router.post('/', protect, authorize('professor', 'coord'), async (req, res) => {
  const { room, start, end, discipline, participants, professor } = req.body;

  if (!room || !start || !end) {
    return res.status(400).json({ msg: 'Campos obrigatórios: room, start, end' });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return res.status(400).json({ msg: 'Datas inválidas' });
  }
  if (startDate >= endDate) {
    return res.status(400).json({ msg: 'Horário inválido: start deve ser menor que end' });
  }

  const professorId = req.user.role === 'coord' ? (professor || req.user._id) : req.user._id;

  // Check for overlapping reservations in the same room (only active)
  const overlap = await Reservation.find({
    room,
    status: 'active',
    $or: [
      { start: { $lt: endDate }, end: { $gt: startDate } },
    ],
  });
  if (overlap.length > 0) {
    return res.status(400).json({ msg: 'Conflito de agendamento' });
  }

  const reservation = new Reservation({
    room,
    professor: professorId,
    discipline: discipline || undefined,
    start: startDate,
    end: endDate,
    participants: Array.isArray(participants) ? participants : [],
  });
  await reservation.save();

  const note = new Notification({
    user: professorId,
    message: `Reserva criada: ${reservation._id}`,
    reservation: reservation._id,
  });
  await note.save();

  res.status(201).json(reservation);
});

// Update reservation (professor owns it or coord)
router.put('/:id', protect, authorize('professor','coord'), async (req, res) => {
const resv = await Reservation.findById(req.params.id);
if (!resv) return res.status(404).json({ msg: 'Reserva não existe' });
if (String(resv.professor) !== String(req.user._id) && req.user.role !== 'coord') return res.status(403).json({ msg: 'Forbidden' });


// allow changing time/room - check conflicts
if (req.body.room || req.body.start || req.body.end) {
const roomId = req.body.room || resv.room;
const s = new Date(req.body.start || resv.start);
const e = new Date(req.body.end || resv.end);
const conflicts = await Reservation.find({ _id: { $ne: resv._id }, room: roomId, status: 'active', $or: [
{ start: { $lt: e }, end: { $gt: s } }
] });
if (conflicts.length) return res.status(400).json({ msg: 'Conflito de agendamento' });
resv.start = s; resv.end = e; resv.room = roomId;
}
if (req.body.status) resv.status = req.body.status;
await resv.save();


// create notification to participants and students (participants array)
const note = new Notification({ user: req.user._id, message: `Reserva atualizada: ${resv._id}`, reservation: resv._id });
await note.save();


res.json(resv);
});


// Cancel reservation
router.delete('/:id', protect, authorize('professor','coord'), async (req, res) => {
const resv = await Reservation.findById(req.params.id);
if (!resv) return res.status(404).json({ msg: 'Not found' });
if (String(resv.professor) !== String(req.user._id) && req.user.role !== 'coord') return res.status(403).json({ msg: 'Forbidden' });
resv.status = 'cancelled';
await resv.save();
const note = new Notification({ user: req.user._id, message: `Reserva cancelada: ${resv._id}`, reservation: resv._id });
await note.save();
res.json({ msg: 'Cancelled' });
});


// List reservations (filters: room, professor, date range)
router.get('/', protect, async (req, res) => {
const { room, professor, from, to } = req.query;
const filter = {};
if (room) filter.room = room;
if (professor) filter.professor = professor;
if (from || to) filter.start = {};
if (from) filter.start.$gte = new Date(from);
if (to) filter.start.$lte = new Date(to);
const list = await Reservation.find(filter).populate('room').populate('professor','name email').populate('discipline');
res.json(list);
});


module.exports = router;