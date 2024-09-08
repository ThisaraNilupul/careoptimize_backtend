const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true},
    address: { type: String, required: true},
    nic: {type: String, required: true},
    phonenumber: {type: String, required: true},
    email: {type: String, required: true},
    birthday: {type: Date, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
}, {timestamps: true});

const patient = mongoose.model('patient', patientSchema);
module.exports = patient;

