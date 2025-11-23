const mongoose = require('mongoose');


const EquipmentSchema = new mongoose.Schema({
name: { type: String, required: true },
description: String
});


module.exports = mongoose.model('Equipment', EquipmentSchema);