const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Sistema de Reservas de Salas - Fametro',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      rooms: '/api/rooms',
      equipments: '/api/equipments',
      disciplines: '/api/disciplines',
      reservations: '/api/reservations',
      notifications: '/api/notifications'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/equipments', require('./routes/equipments'));
app.use('/api/disciplines', require('./routes/disciplines'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/notifications', require('./routes/notifications'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));