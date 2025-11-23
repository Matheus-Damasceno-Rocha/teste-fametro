const mongoose = require('mongoose');

// Desabilitar buffering para falhar rápido se MongoDB não estiver rodando
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, // Falha rápido se não conectar
      socketTimeoutMS: 3000,
    });
    console.log('✅ MongoDB Connected');
    global.mongoConnected = true;
  } catch (err) {
    console.error('❌ MongoDB NÃO conectado:', err.message);
    console.log('\n⚠️  Sistema rodando SEM banco de dados!');
    console.log('📝 Para conectar ao MongoDB:');
    console.log('   1. Inicie: net start MongoDB (Windows como Admin)');
    console.log('   2. Ou veja: INSTALAR_MONGODB.md\n');
    global.mongoConnected = false;
  }
};

module.exports = connectDB;