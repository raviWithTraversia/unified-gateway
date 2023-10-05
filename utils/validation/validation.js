const { check } = require("express-validator");

exports.loginValidation = [
    check('email', 'Email is required').notEmpty().isEmail(),
    check('password', 'Password is required').notEmpty()
]

