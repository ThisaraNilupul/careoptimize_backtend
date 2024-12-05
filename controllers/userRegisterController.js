const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendEmailNotification } = require('../config/emailService');

//Register new user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            showQuickNotification: true,
            message: "Invalied Inputs",
            error: errors.array(),
        });
    }

    const {
        role,
        firstName,
        lastName, 
        addressNo,
        street,
        city,
        province,
        nic, 
        phoneNumber, 
        email, 
        birthday,
        gender,
        username, 
        password
    } = req.body;

    try{
        //check if the username or email allready exists
        let user = await User.findOne({username});
        if (user) return res.status(400).json({msg: 'Username already exists.'});

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeGeneratedAt = new Date();

        //create a new patient
        user = new User({
            role, firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, birthday, gender, username, password: hashedpassword,
            relatives: [],
            verificationCode,
            codeGeneratedAt,
        });

        await user.save();

        const message = `Your verification code is ${verificationCode}`;
        sendEmailNotification(email, message);

        //generate tocken
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.status(200).json({token, msg: 'Registered successfully..! Verification code sent! Please check your email.'});
    } catch (error) {
        console.error("register error:", error.message);
        res.status(500).send('Server error..');
    }
};

//verify user
exports.verifyUser = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({ email: email});
    
        if (!user || user.verificationCode !== code) {
            return res.status(400).json({ msg: 'Invalid verification code.' });
        };

        user.emailVerified = true;
        user.verificationCode = null;
        await user.save();

        res.status(200).json({ msg: 'Verification successful! You can now log in.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error..');
    }
}