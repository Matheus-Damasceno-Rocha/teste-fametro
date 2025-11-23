const mongoose = require('mongoose');


const DisciplineSchema = new mongoose.Schema({
name: { type: String, required: true },
professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Discipline', DisciplineSchema);