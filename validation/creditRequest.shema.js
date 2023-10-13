`use strict`;
const Joi = require('joi');
const schema = {
    creditRequestValidation : Joi.object({
        companyId : Joi.string().required(),
        date : Joi.date(),
        duration : Joi.string(),
        purpose : Joi.string(),
        amount : Joi.number(),
        utilizeAmount : Joi.number(),
        remarks : Joi.string(),
        expireDate : Joi.date(),
        createdDate : Joi.date(),
        createdBy : Joi.string(),
        requestedAmount : Joi.number(),
    }),
};

module.exports = schema;