
'user strict';
const Joi = require('joi');
const schema = {
    productSchema : Joi.object({
        productName : Joi.string().required(),
    }),

    productPlanSchema: Joi.object({
        productPlanName: Joi.string().required(),
        companyId: Joi.string().required(),
    }),


};

module.exports = schema;
