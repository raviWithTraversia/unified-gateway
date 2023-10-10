const { check, oneOf } = require("express-validator");

exports.loginValidation = [
    oneOf([
        check('email').notEmpty().isEmail(),
        check('phoneNumber').notEmpty().isMobilePhone(),
    ], 'Email or phoneNumber is required'),
    check('password', 'Password is required').notEmpty()
]
