const mongoose = require('mongoose');


const ReservationSchema = new mongoose.Schema({
room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
discipline: { type: mongoose.Schema.Types.ObjectId, ref: 'Discipline' },
start: { type: Date, required: true },
end: { type: Date, required: true },
status: { type: String, enum: ['active','cancelled','rejected'], default: 'active' },
participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


// Index to help avoid duplicates
ReservationSchema.index({ room: 1, start: 1, end: 1 }, { unique: false });


module.exports = mongoose.model('Reservation', ReservationSchema);