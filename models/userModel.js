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
    nic: {type: String, required: true,},
    phoneNumber: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    relationship: { type: String, required: true }
});

const biodataSchema = new mongoose.Schema({
    bloodType: {type: String, required: true},
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
});

const userSchema = new mongoose.Schema({
    role: { type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true},
    addressNo: { type: String, required: true},
    street: { type: String, required: true},
    city: { type: String, required: true},
    province: { type: String, required: true},
    nic: {type: String, required: true, unique: true},
    phoneNumber: {type: String, required: true,  unique: true},
    email: {type: String, required: true, unique: true},
    birthday: {type: Date, required: true},
    gender: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},

    biodata: biodataSchema,
    healthIssues: [healthIssueSchema],
    relatives: [relativesSchema]
}, {timestamps: true});

const user = mongoose.model('user', userSchema);
module.exports = user;
