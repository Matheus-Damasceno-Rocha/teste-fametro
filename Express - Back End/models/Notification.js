const mongoose = require('mongoose');


const NotificationSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
message: String,
createdAt: { type: Date, default: Date.now },
reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }
});


module.exports = mongoose.model('Notification', NotificationSchema);