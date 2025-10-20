const mongoose = require('mongoose');


const RoomSchema = new mongoose.Schema({
name: { type: String, required: true },
capacity: Number,
type: String,
location: String,
equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }]
}, { timestamps: true });


module.exports = mongoose.model('Room', RoomSchema);