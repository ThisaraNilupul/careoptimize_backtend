const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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

        //create a new patient
        user = new User({
            role, firstName, lastName, addressNo, street, city, province, nic, phoneNumber, email, birthday, gender, username, password: hashedpassword,
            relatives: []
        });

        await user.save();

        //generate tocken
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.status(200).json({token, msg: 'Registered successfully..!'})

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error..');
    }
};