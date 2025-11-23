const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Equipment = require('../models/Equipment');
const { protect, authorize } = require('../middleware/auth');

// Dados mockados
const mockRooms = [
  { _id: 'r1', name: 'Sala 101', capacity: 40, type: 'classroom', equipment: ['Projetor', 'Quadro Branco', 'Ar Condicionado'], status: 'available' },
  { _id: 'r2', name: 'Lab. Informática 1', capacity: 30, type: 'lab', equipment: ['30 Computadores', 'Projetor', 'Ar Condicionado'], status: 'available' },
  { _id: 'r3', name: 'Sala 203', capacity: 35, type: 'classroom', equipment: ['Projetor', 'Quadro Branco'], status: 'available' },
  { _id: 'r4', name: 'Auditório Principal', capacity: 200, type: 'auditorium', equipment: ['Sistema de Som', 'Projetor', 'Ar Condicionado'], status: 'available' },
  { _id: 'r5', name: 'Lab. Química', capacity: 25, type: 'lab', equipment: ['Bancadas', 'Equipamentos Lab'], status: 'maintenance' },
];


// Create room (coord)
router.post('/', protect, authorize('coord'), async (req, res) => {
const room = new Room(req.body);
await room.save();
res.status(201).json(room);
});


// List rooms (public - visitantes podem ver)
router.get('/', async (req, res) => {
try {
// Se MongoDB não estiver conectado, retorna dados mockados
if (!global.mongoConnected) {
console.log('⚠️  Retornando salas mockadas (MongoDB desconectado)');
return res.json(mockRooms);
}

const rooms = await Room.find().populate('equipments');
res.json(rooms);
} catch (error) {
console.error('Erro ao buscar salas:', error.message);
res.json(mockRooms);
}
});


// Update room
router.put('/:id', protect, authorize('coord'), async (req, res) => {
const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(room);
});


module.exports = router;