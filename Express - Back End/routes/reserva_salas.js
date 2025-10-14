const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { Reserva, Sala } = require('../modelsSQL')
const checkToken = require('../middleware/checkToken')

// Consultas
router.post('/searchbycod', checkToken, async (req, res) => {
  const { cod_reserva } = req.body
  if (!cod_reserva) return res.status(422).json({ msg: 'Digite o codigo da reserva.' })
  try {
    const reservas = await Reserva.findAll({ where: { id: cod_reserva, status: { [Op.ne]: 'D' } } })
    if (!reservas || reservas.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(reservas)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

router.post('/searchbyclass', checkToken, async (req, res) => {
  const { cod_sala } = req.body
  if (!cod_sala) return res.status(422).json({ msg: 'Digite o codigo da sala.' })
  try {
    const r = await Reserva.findAll({ where: { sala_id: cod_sala, status: { [Op.ne]: 'D' } } })
    if (!r || r.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

router.post('/searchbydater', checkToken, async (req, res) => {
  const { date_reserv } = req.body
  if (!date_reserv) return res.status(422).json({ msg: 'Digite a data da reserva.' })
  try {
    const start = new Date(date_reserv)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    const r = await Reserva.findAll({ where: { data_hora: { [Op.gte]: start, [Op.lt]: end }, status: { [Op.ne]: 'D' } } })
    if (!r || r.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

router.post('/searchbydatee', checkToken, async (req, res) => {
  const { date_entrega } = req.body
  if (!date_entrega) return res.status(422).json({ msg: 'Digite a data da entrega.' })
  try {
    const start = new Date(date_entrega)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)
    const r = await Reserva.findAll({ where: { data_hora: { [Op.gte]: start, [Op.lt]: end }, status: { [Op.ne]: 'D' } } })
    if (!r || r.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

// ver todas as reservas não deletadas
router.get('/view', checkToken, async (req, res) => {
  try {
    const r = await Reserva.findAll({ where: { status: { [Op.ne]: 'D' } } })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err}` })
  }
})

// ver as reservas deletadas
router.get('/view_delete', checkToken, async (req, res) => {
  try {
    const r = await Reserva.findAll({ where: { status: 'D' } })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err}` })
  }
})

// Registro da reserva de salas
router.post('/create', checkToken, async (req, res) => {
  const { professor_id, cod_sala, disciplina_id, data_hora } = req.body
  if (!professor_id) return res.status(422).json({ msg: 'Professor é obrigatório' })
  if (!cod_sala) return res.status(422).json({ msg: 'A sala é obrigatória' })
  if (!data_hora) return res.status(422).json({ msg: 'A data/hora é obrigatória' })
  try {
    const sala = await Sala.findByPk(cod_sala)
    if (!sala || sala.status === 'D') return res.status(404).json({ msg: 'Sala não encontrada' })
    const dt = new Date(data_hora)
    const conflito = await Reserva.findOne({ where: { sala_id: cod_sala, data_hora: dt, status: { [Op.ne]: 'D' } } })
    if (conflito) return res.status(409).json({ msg: 'A sala já está reservada' })
    const r = await Reserva.create({ sala_id: cod_sala, professor_id, disciplina_id: disciplina_id || null, data_hora: dt, status: 'A' })
    res.status(200).json({ msg: 'Salvo com sucesso', reserva: r })
  } catch (err) {
    res.status(500).json({ msg: 'Error ao salvar.' + err })
  }
})

// Atualização dos dados da reserva de salas
router.put('/update/:id', checkToken, async (req, res) => {
  const { professor_id, cod_sala, disciplina_id, data_hora } = req.body
  if (!professor_id) return res.status(422).json({ msg: 'Professor é obrigatório' })
  if (!cod_sala) return res.status(422).json({ msg: 'A sala é obrigatória' })
  if (!data_hora) return res.status(422).json({ msg: 'A data/hora é obrigatória' })
  try {
    const sala = await Sala.findByPk(cod_sala)
    if (!sala || sala.status === 'D') return res.status(404).json({ msg: 'Sala não encontrada' })
    const dt = new Date(data_hora)
    const conflito = await Reserva.findOne({ where: { id: { [Op.ne]: req.params.id }, sala_id: cod_sala, data_hora: dt, status: { [Op.ne]: 'D' } } })
    if (conflito) return res.status(409).json({ msg: 'A sala já está reservada' })
    const [rows] = await Reserva.update({ sala_id: cod_sala, professor_id, disciplina_id: disciplina_id || null, data_hora: dt }, { where: { id: req.params.id } })
    if (rows === 0) return res.status(404).json({ msg: 'Reserva de Sala não encontrada.' })
    res.status(200).json({ msg: 'Reserva de Sala atualizada com sucesso!' })
  } catch (err) {
    res.status(400).json({ msg: 'Erro ao atualizar reserva!' })
  }
})

router.put('/delete/:id', checkToken, async (req, res) => {
  try {
    const [rows] = await Reserva.update({ status: 'D' }, { where: { id: req.params.id } })
    if (rows === 0) return res.status(404).json({ msg: 'Reserva de Sala não encontrada.' })
    res.status(200).json({ msg: 'Reserva de Sala deletada com sucesso!' })
  } catch (err) {
    res.status(404).json({ msg: 'Error ao deletar reserva (sala). ERROR: ' + err })
  }
})

module.exports = router
