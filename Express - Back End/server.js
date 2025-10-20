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


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/equipments', require('./routes/equipments'));
app.use('/api/disciplines', require('./routes/disciplines'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/notifications', require('./routes/notifications'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));