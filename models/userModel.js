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
    phoneNumber: {type: String, required: true,},
    email: {type: String, required: true,},
    relationship: { type: String, required: true }
});

//sub-schema for biodata
const biodataSchema = new mongoose.Schema({
    bloodType: {type: String, required: true},
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
});

////sub-schema for hospital-info
const hospitalinfoSchema = new mongoose.Schema({
    placeName: { type: String, required: true },
    h_addressNo: { type: String, required: true},
    h_street: { type: String, required: true},
    h_city: { type: String, required: true},
    h_province: { type: String, required: true},
    h_phoneNumber: {type: String, required: true,},
    h_email: {type: String, required: true,},
});

const doctorinfoSchema = new mongoose.Schema({
    eduLevel: { type: String, required: true},
    specialistArea: {type: String, required: true}
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

    biodata: { type: biodataSchema, required: false, function () { return this.role === "P"; }},
    healthIssues: { type: [healthIssueSchema], required: function () { return this.role === "P"; }},
    relatives: { type: [relativesSchema], required: function () { return this.role === "P"; }},

    workAt : { type: [hospitalinfoSchema], required: function () { return this.role === "D"; }},
    doctorInfo: {type: doctorinfoSchema, required: false, function () { return this.role === "D"; }}
}, {timestamps: true});


userSchema.pre('save', function (next) {
    if (this.role !== "P") {
        this.biodata = undefined;
        this.healthIssues = undefined;
        this.relatives = undefined;
    }
    else if (this.role !== "D") {
        this.workAt = undefined;
        this.doctorInfo = undefined;
    }
    next();
});

const user = mongoose.model('user', userSchema);
module.exports = user;
