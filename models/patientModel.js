const mongoose = require('mongoose');

//sub-schema for health issues
const healthIssueSchema = new mongoose.Schema({
    issue: {type: String}
});

//sub-schema for relatives
const relativesSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    addressNo: { type: String, required: true},
    street: { type: String, required: true},
    city: { type: String, required: true},
    province: { type: String, required: true},
    nic: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    relationship: { type: String, required: true }
});

const patientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    addressNo: { type: String, required: true},
    street: { type: String, required: true},
    city: { type: String, required: true},
    province: { type: String, required: true},
    nic: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    birthday: {type: Date, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    
    bloodType: {type: String, required: true},
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    healthIssues: [healthIssueSchema],
    relatives: [relativesSchema]
}, {timestamps: true});

const patient = mongoose.model('patient', patientSchema);
module.exports = patient;
