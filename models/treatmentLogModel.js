const mongoose = require('mongoose');

const treatmentLogSchema = new mongoose.Schema({
    treatmentId: { type: String, required: true },
    doctorReason: { type: String, required: true },
    closingDate: { type: Date, default: Date.now, },
}, { timestamps: true });

module.exports = mongoose.model('treatmentLog', treatmentLogSchema);