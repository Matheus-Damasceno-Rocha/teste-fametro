const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const { protect, authorize } = require('../middleware/auth');

// Helper para extrair id
const getId = (val) => {
  if (!val) return val;
  if (typeof val === 'string') return val;
  if (val._id) return String(val._id);
  if (val.id) return String(val.id);
  return val;
};

// Coord: create user
router.post('/', protect, authorize('coord'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email) return res.status(400).json({ msg: 'Name and email required' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Email exists' });

    const hash = await bcrypt.hash(password || 'changeme', 10);
    user = new User({ name, email, password: hash, role });
    await user.save();

    const out = user.toObject();
    delete out.password;
    return res.status(201).json(out);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ msg: 'Erro interno ao criar usuário', error: error.message });
  }
});

// Edit user (coord)
router.put('/:id', protect, authorize('coord'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    return res.json(user);
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    return res.status(500).json({ msg: 'Erro interno ao editar usuário', error: error.message });
  }
});

// Delete user (coord) - previne remoção se houver reservas vinculadas
router.delete('/:id', protect, authorize('coord'), async (req, res) => {
  try {
    const userId = getId(req.params.id);
    const linked = await Reservation.find({ professor: userId }).limit(1).lean();
    if (linked && linked.length > 0) return res.status(400).json({ msg: 'Usuário possui reservas vinculadas e não pode ser removido' });

    const deleted = await User.findByIdAndDelete(userId).select('-password');
    if (!deleted) return res.status(404).json({ msg: 'Usuário não encontrado' });
    return res.json({ msg: 'Usuário removido' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error.message);
    return res.status(500).json({ msg: 'Erro interno ao remover usuário', error: error.message });
  }
});

// List users (coord)
router.get('/', protect, authorize('coord'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ msg: 'Erro interno ao listar usuários', error: error.message });
  }
});

// Update own profile (any authenticated user)
router.patch('/me', protect, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 10);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    // aplica updates e salva para garantir hooks
    Object.keys(updates).forEach(k => user[k] = updates[k]);
    await user.save();

    const out = user.toObject();
    delete out.password;
    return res.json(out);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ msg: 'Erro interno ao atualizar perfil', error: error.message });
  }
});

module.exports = router;
