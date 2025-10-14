const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { Sala, Reserva } = require('../modelsSQL')
const checkToken = require('../middleware/checkToken')

//Consultas
router.post('/searchbycod', checkToken, async (req, res) => {
  const { codigo } = req.body
  if (!codigo) return res.status(422).json({ msg: 'Digite algum codigo.' })
  try {
    const salass = await Sala.findAll({ where: { id: codigo, status: { [Op.ne]: 'D' } } })
    if (!salass || salass.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(salass)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err}` })
  }
})

router.post('/searchbyname', checkToken, async (req, res) => {
  const { nome } = req.body
  if (!nome) return res.status(422).json({ msg: 'Digite algum nome.' })
  try {
    const salass = await Sala.findAll({ where: { nome: { [Op.iLike]: `%${nome}%` }, status: { [Op.ne]: 'D' } } })
    if (!salass || salass.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
    res.status(200).json(salass)
  } catch (err) {
    res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
  }
})

    router.post('/searchbystatus', checkToken, async (req, res) => {
      const { status } = req.body
      if (!status) return res.status(422).json({ msg: 'Digite algum status.' })
      try {
        const salass = await Sala.findAll({ where: { status } })
        if (!salass || salass.length === 0) return res.status(404).json({ msg: 'Nenhum dado encontrado' })
        res.status(200).json(salass)
      } catch (err) {
        res.status(404).json({ msg: `Not found. ERROR: ${err} ` })
      }
    })


//Visualização
router.get('/view', checkToken ,async(req,res) =>{
  try{
    const salass = await Sala.findAll({ where: { status: { [Op.ne]: 'D' } } })
    res.status(200).json(salass)
  }catch(err){
    res.status(404).json({msg: `Not found. ERROR: ${err}`})
  }
})

router.get('/view_delete',checkToken ,async(req,res) =>{
  try{
    const salass = await Sala.findAll({ where: { status: 'D' } })
    res.status(200).json(salass)
  }catch(err){
    res.status(404).json({msg: `Not found. ERROR: ${err}`})
  }
})
    

//METODOS CREATE UPDATE E DELETE. 
router.post('/create' ,checkToken ,async(req,res)=>{
  const {nome,status} = req.body
  if(!nome){
    return res.status(422).json({msg: 'O nome é obrigatório'})
  }
  if(!status){
    return res.status(422).json({msg: 'Selecione um status antes de prosseguir!'})
  }
  try{
    const exists = await Sala.findOne({ where: { nome: nome.toUpperCase(), status: { [Op.ne]: 'D' } } })
    if(exists) return res.status(404).json({msg:'Nome já existe.'})
    await Sala.create({ nome: nome.toUpperCase(), status })
    res.status(200).json({msg:'Salvo com sucesso'})
  }catch(err){
    res.status(404).json({msg:'Error ao salvar.'+err})
  }
})



router.put('/update/:id', checkToken,async(req,res)=>{
  const {nome,status} = req.body
  if(!nome) return res.status(422).json({msg: 'O nome é obrigatório'})
  if(!status) return res.status(422).json({msg: 'Selecione um status antes de prosseguir!'})
  try{
    const nameExists = await Sala.findOne({ where: { id: { [Op.ne]: req.params.id }, nome: nome.toUpperCase(), status: { [Op.ne]: 'D' } } })
    if(nameExists) return res.status(404).json({msg:'Nome já está registrado no banco.'})
    const [rows] = await Sala.update({ nome: nome.toUpperCase(), status }, { where: { id: req.params.id } })
    if(rows === 0) return res.status(404).json({msg:'Sala não encontrada.'})
    res.status(200).json({msg:'Sala atualizada com sucesso!'})
  }catch(err){
    res.status(404).json({msg:'Error ao atualizar sala!'})
  }
})


router.put('/delete/:id',checkToken ,async(req,res)=>{ 
  try{
    await Reserva.update({ status: 'D' }, { where: { sala_id: req.params.id } })
    const [rows] = await Sala.update({ status: 'D' }, { where: { id: req.params.id } })
    if(rows === 0) return res.status(404).json({msg:'Sala não encontrada.'})
    res.status(200).json({msg:'Sala deletada com sucesso!'})
  }catch(err){
    res.status(404).json({msg:'Error ao deletar sala. ERROR: '+err})
  }
})  



//DISCLAMER: O DELETE TOTAL NÃO SERÁ USADO EM NENHUM MOMENTO PELO USUÁRIO 
//O ADMINISTRADOR DO SITE. ELE APENAS SERÁ USADOS PELOS DEVS PARA LIMPAR O BANCO DE DADOS.

/*router.delete('/delete_total/:id',checkToken ,async(req,res)=>{
    await Salas.deleteOne({_id: req.params.id}).then(()=>{
      res.status(200).json({msg:'Deletado totalmente.'})
      }).catch((err)=>{
      res.status(404).json({msg:'Falha ao deletar'})
      
     })
  })

  router.delete('/delete_everything',checkToken,async(req,res)=>{
    await Salas.deleteMany({}).then(()=>{
     res.status(200).json({msg:'Deletado com sucesso!'})
    }).catch((err)=>{
        res.status(404).json({msg:'Não foi possivel deletar'})
    })
})

*/


module.exports = router