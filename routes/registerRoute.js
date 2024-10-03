const express = require('express');
const { check } = require('express-validator');
const {registerUser} = require('../controllers/userRegisterController');
const auth = require('../middleware/auth');
const router = express.Router();

//Register user
router.post('/register',
    [
        check('role').isIn(['P','D','S']).notEmpty().withMessage('User role is required'),
        check('firstName').trim().isString().withMessage('Name can only be a string'),
        check('lastName').trim().isString().withMessage('Name can only be a string'),
        check('addressNo').trim().notEmpty().withMessage('Invalid addressNo Address'),
        check('street').trim().notEmpty().withMessage('Invalid street Address'),
        check('city').trim().isString().withMessage('Invalid City Name'),
        check('province').trim().isString().withMessage('Invalid Province'),
        check('nic').trim().notEmpty().withMessage('Add NIC number.'),
        check('phoneNumber').isString().trim().isLength({ min: 10, max: 10 }).withMessage('Invalid phone number'),
        check('email').trim().isEmail().withMessage('Invalid Email'),
        check('birthday').optional().isISO8601().toDate().withMessage('Invalid date of birth'),
        check('gender').optional().isIn(['M', 'F', 'O']).withMessage('Invalid gender'),
        check('username').not().isEmpty().withMessage('Username is required'),
        check('password').isLength({ min: 6 }).withMessage('Password must be 6 or more characters'),
    ], 
        registerUser
    );

    module.exports = router;    