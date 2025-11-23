const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

// Utilitário para extrair um id (aceita string ou objeto {_id: ...})
const getId = (val) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (mongoose.Types.ObjectId.isValid(String(val))) return String(val);
  if (val._id) return String(val._id);
  if (val.id) return String(val.id);
  return val;
};

// Dados mockados para quando MongoDB não estiver conectado
const mockReservations = [
  {
    _id: '1',
    room: { _id: 'r1', name: 'Sala 101' },
    professor: { _id: 'p1', name: 'Prof. João Silva', email: 'joao@fametro.edu.br' },
    discipline: { _id: 'd1', name: 'Matemática Aplicada' },
    start: new Date(2024, 0, 15, 8, 0).toISOString(),
    end: new Date(2024, 0, 15, 10, 0).toISOString(),
    status: 'active',
    participants: []
  },
  // ... outros mockados omitidos para brevidade
];

// Create reservation (professor or coord)
router.post('/', protect, authorize('professor', 'coord'), async (req, res) => {
  try {
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

    // professorId: se coord, pode criar em nome de outro professor
    const professorIdRaw = req.user.role === 'coord' ? (professor || req.user._id) : req.user._id;
    const professorId = getId(professorIdRaw);
    const roomId = getId(room);

    // Checa conflitos (somente reservas ativas no mesmo ambiente)
    const overlap = await Reservation.find({
      room: roomId,
      status: 'active',
      $or: [
        { start: { $lt: endDate }, end: { $gt: startDate } },
      ],
    }).lean();

    if (overlap && overlap.length > 0) {
      return res.status(400).json({ msg: 'Conflito de agendamento' });
    }

    const reservation = new Reservation({
      room: roomId,
      professor: professorId,
      discipline: discipline ? getId(discipline) : undefined,
      start: startDate,
      end: endDate,
      participants: Array.isArray(participants) ? participants : [],
      status: 'active',
    });

    await reservation.save();

    const note = new Notification({
      user: professorId,
      message: `Reserva criada: ${reservation._id}`,
      reservation: reservation._id,
    });
    await note.save();

    // Popula campos importantes antes de responder
    const populated = await Reservation.findById(reservation._id)
      .populate('room')
      .populate('professor', 'name email')
      .populate('discipline');

    return res.status(201).json(populated);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return res.status(500).json({ msg: 'Erro interno ao criar reserva', error: error.message });
  }
});

// Update reservation (professor owns it or coord)
router.put('/:id', protect, authorize('professor','coord'), async (req, res) => {
  try {
    const resv = await Reservation.findById(req.params.id);
    if (!resv) return res.status(404).json({ msg: 'Reserva não existe' });

    if (String(resv.professor) !== String(req.user._id) && req.user.role !== 'coord')
      return res.status(403).json({ msg: 'Forbidden' });

    // allow changing time/room - check conflicts
    if (req.body.room || req.body.start || req.body.end) {
      const roomId = getId(req.body.room) || getId(resv.room);
      const s = new Date(req.body.start || resv.start);
      const e = new Date(req.body.end || resv.end);

      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
        return res.status(400).json({ msg: 'Datas inválidas' });
      }
      if (s >= e) return res.status(400).json({ msg: 'Horário inválido: start deve ser menor que end' });

      const conflicts = await Reservation.find({
        _id: { $ne: resv._id },
        room: roomId,
        status: 'active',
        $or: [
          { start: { $lt: e }, end: { $gt: s } }
        ]
      }).lean();

      if (conflicts && conflicts.length) return res.status(400).json({ msg: 'Conflito de agendamento' });

      resv.start = s;
      resv.end = e;
      resv.room = roomId;
    }

    if (req.body.status) resv.status = req.body.status;
    if (req.body.participants) resv.participants = Array.isArray(req.body.participants) ? req.body.participants : resv.participants;

    await resv.save();

    const note = new Notification({ user: req.user._id, message: `Reserva atualizada: ${resv._id}`, reservation: resv._id });
    await note.save();

    const populated = await Reservation.findById(resv._id)
      .populate('room')
      .populate('professor', 'name email')
      .populate('discipline');

    return res.json(populated);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    return res.status(500).json({ msg: 'Erro interno ao atualizar reserva', error: error.message });
  }
});

// Cancel reservation
router.delete('/:id', protect, authorize('professor','coord'), async (req, res) => {
  try {
    const resv = await Reservation.findById(req.params.id);
    if (!resv) return res.status(404).json({ msg: 'Not found' });

    if (String(resv.professor) !== String(req.user._id) && req.user.role !== 'coord')
      return res.status(403).json({ msg: 'Forbidden' });

    resv.status = 'cancelled';
    await resv.save();

    const note = new Notification({ user: req.user._id, message: `Reserva cancelada: ${resv._id}`, reservation: resv._id });
    await note.save();

    return res.json({ msg: 'Cancelled' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    return res.status(500).json({ msg: 'Erro interno ao cancelar reserva', error: error.message });
  }
});

// List reservations (filters: room, professor, date range) - PUBLIC para visitantes
router.get('/', async (req, res) => {
  try {
    // Se MongoDB não estiver conectado, retorna dados mockados
    if (!global.mongoConnected) {
      console.log('⚠️  Retornando dados mockados (MongoDB desconectado)');
      return res.json(mockReservations);
    }

    const { room, professor, from, to, status } = req.query;
    const filter = {};

    // Por padrão retornamos apenas reservas ativas para a listagem pública
    if (status) filter.status = status;
    else filter.status = 'active';

    if (room) filter.room = getId(room);
    if (professor) filter.professor = getId(professor);

    if (from || to) {
      filter.start = {};
      if (from) {
        const d = new Date(from);
        if (Number.isNaN(d.getTime())) return res.status(400).json({ msg: 'Data "from" inválida' });
        filter.start.$gte = d;
      }
      if (to) {
        const d = new Date(to);
        if (Number.isNaN(d.getTime())) return res.status(400).json({ msg: 'Data "to" inválida' });
        filter.start.$lte = d;
      }
    }

    const list = await Reservation.find(filter)
      .populate('room')
      .populate('professor', 'name email')
      .populate('discipline')
      .lean();

    return res.json(list);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error.message);
    // Retorna dados mockados em caso de erro
    return res.json(mockReservations);
  }
});

module.exports = router;
