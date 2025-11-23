const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Room = require('../models/Room');
const Equipment = require('../models/Equipment');
const Reservation = require('../models/Reservation');
const { protect, authorize } = require('../middleware/auth');

// Dados mockados
const mockRooms = [
  { _id: 'r1', name: 'Sala 101', capacity: 40, type: 'classroom', equipment: ['Projetor', 'Quadro Branco', 'Ar Condicionado'], status: 'available' },
  { _id: 'r2', name: 'Lab. Informática 1', capacity: 30, type: 'lab', equipment: ['30 Computadores', 'Projetor', 'Ar Condicionado'], status: 'available' },
  { _id: 'r3', name: 'Sala 203', capacity: 35, type: 'classroom', equipment: ['Projetor', 'Quadro Branco'], status: 'available' },
  { _id: 'r4', name: 'Auditório Principal', capacity: 200, type: 'auditorium', equipment: ['Sistema de Som', 'Projetor', 'Ar Condicionado'], status: 'available' },
  { _id: 'r5', name: 'Lab. Química', capacity: 25, type: 'lab', equipment: ['Bancadas', 'Equipamentos Lab'], status: 'maintenance' },
];

// Helper para extrair id
const getId = (val) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (val._id) return String(val._id);
  if (val.id) return String(val.id);
  return val;
};

// Create room (coord)
router.post('/', protect, authorize('coord'), async (req, res) => {
  try {
    const { name, capacity, type, equipment, status } = req.body;
    if (!name) return res.status(400).json({ msg: 'Nome da sala é obrigatório' });

    // Validações simples
    const allowedStatuses = ['available', 'maintenance', 'unavailable'];
    if (status && !allowedStatuses.includes(status)) return res.status(400).json({ msg: 'Status inválido' });

    const room = new Room({ name, capacity, type, equipment, status: status || 'available' });
    await room.save();

    // popula equipamentos se houver referência
    await room.populate('equipment').execPopulate?.();

    return res.status(201).json(room);
  } catch (error) {
    console.error('Erro ao criar sala:', error);
    return res.status(500).json({ msg: 'Erro interno ao criar sala', error: error.message });
  }
});

// List rooms (public - visitantes podem ver) com filtros
router.get('/', async (req, res) => {
  try {
    // Se MongoDB não estiver conectado, retorna dados mockados
    if (!global.mongoConnected) {
      console.log('⚠️  Retornando salas mockadas (MongoDB desconectado)');
      return res.json(mockRooms);
    }

    const { name, type, status } = req.query;
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (type) filter.type = type;
    if (status) filter.status = status;

    // tenta popular ambos caminhos caso o schema use "equipment" ou "equipments"
    let query = Room.find(filter);
    query = query.populate('equipment').populate('equipments');

    const rooms = await query.exec();
    return res.json(rooms);
  } catch (error) {
    console.error('Erro ao buscar salas:', error.message);
    return res.json(mockRooms);
  }
});

// Update room (coord)
router.put('/:id', protect, authorize('coord'), async (req, res) => {
  try {
    const updates = req.body;
    if (updates.status) {
      const allowedStatuses = ['available', 'maintenance', 'unavailable'];
      if (!allowedStatuses.includes(updates.status)) return res.status(400).json({ msg: 'Status inválido' });
    }

    const room = await Room.findByIdAndUpdate(req.params.id, updates, { new: true }).lean();
    if (!room) return res.status(404).json({ msg: 'Sala não encontrada' });
    return res.json(room);
  } catch (error) {
    console.error('Erro ao atualizar sala:', error.message);
    return res.status(500).json({ msg: 'Erro interno ao atualizar sala', error: error.message });
  }
});

// Delete room (coord) - tenta prevenir remoção se existem reservas ativas
router.delete('/:id', protect, authorize('coord'), async (req, res) => {
  try {
    const roomId = getId(req.params.id);
    // checar reservas ativas vinculadas
    const activeReservations = await Reservation.find({ room: roomId, status: 'active' }).limit(1).lean();
    if (activeReservations && activeReservations.length > 0) {
      return res.status(400).json({ msg: 'Não é possível remover sala com reservas ativas' });
    }

    const deleted = await Room.findByIdAndDelete(roomId);
    if (!deleted) return res.status(404).json({ msg: 'Sala não encontrada' });
    return res.json({ msg: 'Sala removida' });
  } catch (error) {
    console.error('Erro ao deletar sala:', error.message);
    return res.status(500).json({ msg: 'Erro interno ao deletar sala', error: error.message });
  }
});

module.exports = router;
