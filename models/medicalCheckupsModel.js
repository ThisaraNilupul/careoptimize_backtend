const mongoose = require('mongoose');

const medicalCheckupsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assignById: { type: String, required: true },
    assignByfirstName:  { type: String, required: true },
    assignBylastName:  { type: String, required: true },
    treatmentId: { type: String, required: true },
    evaluateById: { type: String, required: true },
    evaluateByfirstName:  { type: String, required: true },
    evaluateBylastName:  { type: String, required: true },
    testName: {type: String },
    status: { type: String, enum: ['Positive', 'Negative'] },
    feedback: { type: String },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('checkups', medicalCheckupsSchema);