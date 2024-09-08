const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patientModel');

//Login a patient
exports.loginPatient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            showQuickNotification: true,
            message: "Invalied Inputs",
            error: errors.array(),
        });
    }

    const { username, password} = req.body;

    try{
        //find the patient by username
        let patient = await Patient.findOne({ username });
        if (!patient) return res.status(400).json({msg: 'Invalid Username'});

        //compare the password
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) return res.status(400).json({msg: 'Invalid password'});

        //generate token
        const token = jwt.sign({id: patient.id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}