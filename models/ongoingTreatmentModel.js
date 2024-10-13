const mongoose = require('mongoose');

//sub-schema for checkups
const checkupSchema = new mongoose.Schema({
    testName: {type: String },
    evaluationDate: { type: Date },
    evaluated: { type: Boolean, default: false }
});

//sub-schema for treatment plan
const treatmentPlanSchema = new mongoose.Schema({
    drugName: { type: String, required: true },
    dosage: { type: String, required: true },
    hourly: { type: String },
    times: [{ type: String }], 
    mealInstruction: { type: String, enum: ['Before Meals', 'After Meals'] },
});

//schema for doctor info
const doctorsInfoSchema = new mongoose.Schema({
    doctorId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: { type: String },
    doctorPhone: { type: String, required: true },
    doctorEmail: { type: String, required: true },
});

//schema for hospital info
const clinicInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    addressNo: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    hospitalPhone: { type: String, required: true },
    hospitalEmail: { type: String, required: true },
  });

  const treatmentSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    patientName: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    diagnosis: { type: String, required: true },
    diagnosisDescription: { type: String, required: true },
    prescription: { type: String },
    checkups: [checkupSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    treatmentPlans: [treatmentPlanSchema],
    doctorInfo: doctorsInfoSchema,
    hospitalInfo : clinicInfoSchema,
  }, { timestamps: true });

  module.exports = mongoose.model('Treatment', treatmentSchema);