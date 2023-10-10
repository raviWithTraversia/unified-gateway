
const commonResponse = require('../utils/commonResponce');
const constants = require('../utils/constants');
const userSchema = require('./user.schema');
const { ServerStatusCode } = constants;

const errorMessage = (value, res, next) => {
    if (value.error) {
        console.log(value.error, '+++++++++++');
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
    userRegistration : async (req,res,next) => {
        const value = await userSchema.userSchemaRegistration.validate(req.body);
        errorMessage(value, res, next);
    },

    userLogin : async (req,res,next) => {
        const value = await userSchema.userSchemaLogin.validate(req.body);
        errorMessage(value,res,next)
    },

    userInsert : async (req,res,next) => {
        const value = await userSchema.userSchemaInsert.validate(req.body);
        errorMessage(value, res,next)
    },

    userForgetPassword : async (req,res,next) => {
        const value = await userSchema.userSchemaForgetPassword.validate(req.body);
        errorMessage(value, res, next);
    },
    userResetPassword : async (req,res,next) => {
        const value = await userSchema.userSchemaResetPassword.validate(req.body);
        errorMessage(value, res, next)

    }
}