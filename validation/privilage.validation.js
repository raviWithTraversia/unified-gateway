const privilageSchema = require('./privilage.schema');
const constants = require('../utils/constants');
const commonResponse = require('../utils/commonResponce');
const { ServerStatusCode } = constants;

const errorMessage = (value, res, next) => {
    if (value.error) {
        console.log(value.error.details[0].message);
        commonResponse.apiErrorres(
            res,
            value.error.details[0].message,
            ServerStatusCode.UNPROCESSABLE,
            true
        );
    } else {
        next();
    }
};

module.exports = {
    privilageValidation : async(req ,res , next) => {
        const value = await privilageSchema.privilageSchemaValidation.validate(req.body);
        errorMessage(value, res, next);
    },
 
}