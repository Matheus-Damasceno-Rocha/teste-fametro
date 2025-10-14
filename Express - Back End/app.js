require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const { sequelize } = require('./db')
// Remove Mongoose usage; we are migrating to PostgreSQL via Sequelize
// const mongoose = require('mongoose')
const cors = require('cors')
const checkToken = require('./middleware/checkToken')

//importação das rotas auth
const refresh = require('./routes/refresh')
const auth = require('./routes/auth')

const equip = require('./routes/equip')
const salas = require('./routes/salas')
const reserva_salas = require('./routes/reserva_salas')
const reserva_equip = require('./routes/reserva_equip')

// const corsOptions = {
//     // origin: 'https://front-end-c-l-e-e.vercel.app',
//     origin: 'http://localhost:4200',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
// };

app.use(cors());

// Initialize Sequelize connection and sync models
async function initDatabase() {
  try {
    await sequelize.authenticate();
    const shouldSync = (process.env.DB_SYNC || 'false').toLowerCase() === 'true';
    if (shouldSync) {
      await sequelize.sync();
    }
    console.log('PostgreSQL connection established');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1);
  }
}


// models (Sequelize)
const { Usuario, Reserva: ReservaModel } = require('./modelsSQL')

app.use(express.json())

//open route
app.get('/', async (req, res) => {
  try {
    const reservas = await ReservaModel.findAll({ limit: 10, order: [['id', 'DESC']] });
    res.status(200).json({ msg: 'Bem vindo a API', reservas });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao consultar', error: String(err) });
  }
})

app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id
  try {
    const user = await Usuario.findByPk(id, { attributes: { exclude: ['senha'] } })
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' })
    }
    res.status(200).json({ user })
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao consultar usuário' })
  }
})
    //rotas de registro e login
      app.use('/auth',auth)

      //rota do refresh
      app.use(refresh)
      
      //rotas do admnistrador
      app.use('/equip', equip)
      app.use('/reserva_salas',reserva_salas)
      app.use('/salas', salas)
      app.use('/reserva_equip' , reserva_equip)
      
const port = process.env.PORT || process.env.DB_PORT || 3000

initDatabase().then(() => {
  app.listen(port, () => console.log(`API running on :${port}`))
})