const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patientModel');


//get patient profile
exports.getPatientProfile = async (req, res) => {
    try{
        // Find the patient by the ID attached by the auth middleware
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found'});
        }
        res.json(patient);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
};

//update medical bio-data
exports.addMedicalBioData = async (req, res) => {
    const { bloodType, height, weight, healthIssues } = req.body;

    try {
        const patient = await Patient.findById(req.params.id);
        if(!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }
        patient.bloodType = bloodType || patient.bloodType;
        patient.height = height || patient.height;
        patient.weight = weight || patient.weight;
        if (Array.isArray(healthIssues) && healthIssues.length){
            patient.healthIssues.push(...healthIssues.map(issue => ({issue})));
        }

        await patient.save();
        res.status(200).json({msg: 'Medical bio-data updated successfully', patient});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error: error.message});
    }
};

//get medical bio-data
exports.getMedicalBio = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        const medicalBioData = {
            bloodType: patient.bloodType,
            height: patient.height,
            weight: patient.weight,
            healthIssues: patient.healthIssues
        }

        res.status(200).json(medicalBioData);
    }catch (error) { 
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

//add patient's relatives
exports.addrelative = async (req, res) => {
    const { firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, relationship} = req.body;

    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient){
            return res.status(404).json({msg: 'Patient not found'});
        }

        const newRelative = { firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, relationship};
        patient.relatives.push(newRelative);

        await patient.save();
        res.status(200).json({msg: 'Relative added successfully', patient});
    }catch (error){
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

//get all patient's relatives
exports.getRelatives = async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }
        res.status(200).json(patient.relatives);
    }catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};