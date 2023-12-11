`use strict`;
const Joi = require('joi');
const schema = {
    privilageSchemaValidation : Joi.object({
        companyId : Joi.string().required(),
        privilagePlanName : Joi.string().required(),
        productPlanId : Joi.string().required(),
        permission : Joi.array().required(),
        // status :
    }),
};

module.exports = schema;