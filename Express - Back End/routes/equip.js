const express = require("express");
const router = express.Router();
const { Op } = require('sequelize')
const { Equipamento, Sala, SalaEquipamento } = require('../modelsSQL')
const checkToken = require('../middleware/checkToken')


//Consultas
router.post('/searchbycod',checkToken,async(req,res)=>{
  const {codigo} = req.body
  if(!codigo) return res.status(422).json({msg:'Digite algum codigo.'})
  try{
    const equips = await Equipamento.findAll({ where: { id: codigo } })
    if(!equips || equips.length===0) return res.status(404).json({msg:'Nenhum dado encontrado'})
    res.status(200).json(equips)
  }catch(err){
    res.status(404).json({msg:`Not found. ERROR: ${err} `})
  }
})
  
  router.post('/searchbyname',checkToken,async(req,res)=>{
      const {nome} = req.body
      if(!nome) return res.status(422).json({msg:'Digite algum nome.'})
      try{
        const equips = await Equipamento.findAll({ where: { descricao: { [Op.iLike]: `%${nome}%` } } })
        if(!equips || equips.length===0) return res.status(404).json({msg:'Nenhum dado encontrado'})
        res.status(200).json(equips)
      }catch(err){
        res.status(404).json({msg:`Not found. ERROR: ${err} `})
      }
      })
  
      router.post('/searchbystatus',checkToken,async(req,res)=>{
          const {status} = req.body
          if(!status) return res.status(422).json({msg:'Digite algum status.'})
          // Equipamento doesn't have status in our ER, skip or implement if needed
          return res.status(200).json([])
          })

          //Visualização

router.get("/view", checkToken, async (req,res) =>{
  try{
    const equips = await Equipamento.findAll()
    res.status(200).json(equips)
  }catch(err){
    res.status(404).json({msg:'Não foi encontrado nenhum registro no banco'})
  }
});

router.get("/view_delete", checkToken,async (req,res) =>{
  res.status(200).json([])
  });

//METODOS CREATE, UPDATE E DELETE

router.post('/create' , checkToken,async(req,res)=>{
  const {nome} = req.body
  if(!nome) return res.status(422).json({msg:'Informe um equipamento valido'})
  try{
    const exists = await Equipamento.findOne({ where: { descricao: nome.toUpperCase() } })
    if(exists) return res.status(404).json({msg:'Nome já existe.'})
    await Equipamento.create({ descricao: nome.toUpperCase() })
    res.status(200).json({msg:'Salvo com sucesso'})
  }catch(err){
    res.status(404).json({msg:'Error ao salvar.'+err})
  }
})



    ;
//listar TODOS os equipamentos, o metodo findOne não será usado para pesquisa de equipamentos

//o update_equip é para atualizar/editar equipamentos (que surprendente),
router.put('/update/:id',checkToken ,async(req,res)=>{
  const {nome} = req.body
  if(!nome) return res.status(422).json({msg: 'O nome é obrigatório'})
  try{
    const exists = await Equipamento.findOne({ where: { id: { [Op.ne]: req.params.id }, descricao: nome.toUpperCase() } })
    if(exists) return res.status(404).json({msg:'Nome já está registrado no banco.'})
    const [rows] = await Equipamento.update({ descricao: nome.toUpperCase() }, { where: { id: req.params.id } })
    if(rows === 0) return res.status(404).json({msg:'Equipamento não encontrado.'})
    res.status(200).json({msg:'Equipamento atualizado com sucesso!'})
  }catch(err){
    res.status(404).json({msg:'Error ao atualizar equipamento!'})
  }
})

  //deletando o equipamento
  router.put('/delete/:id',checkToken ,async(req,res)=>{ 
    try{
      const rows = await Equipamento.destroy({ where: { id: req.params.id } })
      if(rows === 0) return res.status(404).json({msg:'Equipamento não encontrado.'})
      res.status(200).json({msg:'Equipamento deletado com sucesso!'})
    }catch(err){
      res.status(404).json({msg:'Error ao deletar equipamento. ERROR: '+err})
    }
  })


 //DISCLAMER - DELETE SO PODE SER USADO POR DESENVOLVEDORES EM AMBIENTE DE TESTE.
 /*
  router.delete('/delete_everything',checkToken ,async(req,res)=>{
    await Equips.deleteMany({}).then(()=>{
     res.status(200).json({msg:'Deletado com sucesso!'})
    }).catch((err)=>{
        res.status(404).json({msg:'Não foi possivel deletar'})
    })
})
*/

   

module.exports = router;
