// Simple seeding script to create coord user, a professor, a student and some rooms/equipments
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Room = require('./models/Room');
const Equipment = require('./models/Equipment');


dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany();
  await Room.deleteMany();
  await Equipment.deleteMany();


  const pass = await bcrypt.hash('password', 10);
  const coord = await User.create({ name: 'Coordenação', email: 'coord@uni.edu', password: pass, role: 'coord' });
  const prof = await User.create({ name: 'Professor A', email: 'prof@uni.edu', password: pass, role: 'professor' });
  const student = await User.create({ name: 'Aluno A', email: 'aluno@uni.edu', password: pass, role: 'student' });


  const eq1 = await Equipment.create({ name: 'Projetor' });
  const eq2 = await Equipment.create({ name: 'Quadro Branco' });


  const r1 = await Room.create({ name: 'Sala 101', capacity: 40, type: 'teorica', location: 'Bloco A', equipments: [eq1._id, eq2._id] });
  const r2 = await Room.create({ name: 'Laboratório 1', capacity: 20, type: 'lab', location: 'Bloco B', equipments: [eq1._id] });


  console.log('Seed finished');
  mongoose.disconnect();
}

seed();