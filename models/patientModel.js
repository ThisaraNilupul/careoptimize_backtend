const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    addressNo: { type: String, required: true},
    street: { type: String, required: true},
    city: { type: String, required: true},
    province: { type: String, required: true},
    nic: {type: String, required: true, unique: true},
    phonenumber: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    birthday: {type: Date, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
}, {timestamps: true});

const patient = mongoose.model('patient', patientSchema);
module.exports = patient;

