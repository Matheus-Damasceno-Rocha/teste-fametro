const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { Reserva, Equipamento } = require('../modelsSQL')
const checkToken = require('../middleware/checkToken')

// Buscar por código da reserva
router.post('/searchbycod', checkToken, async (req, res) => {
  const { cod_reserva } = req.body
  if (!cod_reserva) return res.status(422).json({ msg: 'Digite o codigo da reserva.' })
  try {
    const r = await Reserva.findAll({ where: { id: cod_reserva, status: { [Op.ne]: 'D' } } })
    if (!r || r.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

// Buscar reservas (de equipamento) por código do equipamento
router.post('/searchbyequip', checkToken, async (req, res) => {
  const { cod_equip } = req.body
  if (!cod_equip) return res.status(422).json({ msg: 'Digite o codigo do equipamento.' })
  try {
    // Neste modelo ER, reservas de equipamento não estão modeladas diretamente.
    // Expondo uma lista vazia para manter compatibilidade de rota.
    return res.status(200).json([])
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

// Listar
router.get('/view', checkToken, async (req, res) => {
  try {
    const r = await Reserva.findAll({ where: { status: { [Op.ne]: 'D' } } })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err}` })
  }
})

router.get('/view_delete', checkToken, async (req, res) => {
  try {
    const r = await Reserva.findAll({ where: { status: 'D' } })
    res.status(200).json(r)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err}` })
  }
})

// Criar reserva (placeholder para compatibilidade)
router.post('/create', checkToken, async (req, res) => {
  const { professor_id, cod_equip, data_hora } = req.body
  if (!professor_id) return res.status(422).json({ msg: 'Professor é obrigatório' })
  if (!cod_equip) return res.status(422).json({ msg: 'Equipamento é obrigatório' })
  if (!data_hora) return res.status(422).json({ msg: 'A data/hora é obrigatória' })
  try {
    const equip = await Equipamento.findByPk(cod_equip)
    if (!equip) return res.status(404).json({ msg: 'Equipamento não encontrado' })
    const dt = new Date(data_hora)
    const conflito = await Reserva.findOne({ where: { professor_id, data_hora: dt, status: { [Op.ne]: 'D' } } })
    if (conflito) return res.status(409).json({ msg: 'Já existe reserva no mesmo horário' })
    const r = await Reserva.create({ professor_id, data_hora: dt, status: 'A' })
    res.status(200).json({ msg: 'Salvo com sucesso', reserva: r })
  } catch (err) {
    res.status(500).json({ msg: 'Error ao salvar.' + err })
  }
})

// Atualizar reserva (placeholder)
router.put('/update/:id', checkToken, async (req, res) => {
  const { professor_id, cod_equip, data_hora } = req.body
  if (!professor_id) return res.status(422).json({ msg: 'Professor é obrigatório' })
  if (!cod_equip) return res.status(422).json({ msg: 'Equipamento é obrigatório' })
  if (!data_hora) return res.status(422).json({ msg: 'A data/hora é obrigatória' })
  try {
    const equip = await Equipamento.findByPk(cod_equip)
    if (!equip) return res.status(404).json({ msg: 'Equipamento não encontrado' })
    const dt = new Date(data_hora)
    const conflito = await Reserva.findOne({ where: { id: { [Op.ne]: req.params.id }, professor_id, data_hora: dt, status: { [Op.ne]: 'D' } } })
    if (conflito) return res.status(409).json({ msg: 'Já existe reserva no mesmo horário' })
    const [rows] = await Reserva.update({ professor_id, data_hora: dt }, { where: { id: req.params.id } })
    if (rows === 0) return res.status(404).json({ msg: 'Reserva de Equipamento não encontrada.' })
    res.status(200).json({ msg: `Reserva de Equipamento atualizada com sucesso!` })
  } catch (err) {
    res.status(400).json({ msg: 'Erro ao atualizar reserva!' })
  }
})

// Deletar (soft delete)
router.put('/delete/:id', checkToken, async (req, res) => {
  try {
    const [rows] = await Reserva.update({ status: 'D' }, { where: { id: req.params.id } })
    if (rows === 0) return res.status(404).json({ msg: 'Reserva de Equipamento não encontrada.' })
    res.status(200).json({ msg: 'Reserva de Equipamento deletada com sucesso!' })
  } catch (err) {
    res.status(404).json({ msg: 'Error ao deletar reserva (equipamento). ERROR: ' + err })
  }
})

module.exports = router
