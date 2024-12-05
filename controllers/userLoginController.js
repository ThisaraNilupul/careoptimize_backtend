const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

//Login a patient
exports.loginUser = async (req, res) => {
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
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({msg: 'Invalid Username'});

        //compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({msg: 'Invalid password'});

        if (!user.emailVerified)  return res.status(403).json({ msg: 'Please verify your email before logging in.' });

        //generate token
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.json({token, userId: user._id, role: user.role, firstName: user.firstName, lastName: user.lastName});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}