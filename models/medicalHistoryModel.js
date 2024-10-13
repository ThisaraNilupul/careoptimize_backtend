const mongoose = require('mongoose');

  const medicalHistorySchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    doctorReason: { type: String, required: true },
    treatmentInfo: { type: Object, required: true },
    closedDate: { type: Date, required: true },
  }, { timestamps: true });

  module.exports = mongoose.model('medicalhistory', medicalHistorySchema);