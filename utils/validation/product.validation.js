const {check } = require('express-validator');

exports.productValidation = [
    check('productName', 'productName is required').notEmpty()
]