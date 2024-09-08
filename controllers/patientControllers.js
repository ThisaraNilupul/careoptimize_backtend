const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patientModel');

//get patient profile
exports.getPatientProfile = async (req, res) => {
    try{
        // Find the patient by the ID attached by the auth middleware
        const patient = await Patient.findById(req.user).select('-password');
        if (!patient) {
            res.status(404).json({ msg: 'Patient not found'});
        }
        res.json(patient);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
};