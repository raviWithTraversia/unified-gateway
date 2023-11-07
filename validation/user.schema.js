'user strict';
const Joi = require('joi');
const schema = {
   
      userSchemaRegistration: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
    }),

    userSchemaLogin: Joi.object({
        email: Joi.string().email(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        password: Joi.string().min(6).required(),
      }).or('email', 'phoneNumber'),

    userSchemaInsert :  Joi.object({
        company_ID: Joi.string().required(),
        login_Id: Joi.string().required(),
        email: Joi.string().email().required(),
        deactivation_Date: Joi.string().allow(null), // Assuming it can be a string or null
        logoURI: Joi.string(),
        title: Joi.string(),
        fname: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string(),
        securityStamp: Joi.string(),
        phoneNumber: Joi.string(),
        twoFactorEnabled: Joi.boolean(),
        lockoutEnabled: Joi.boolean(),
        accessfailedCount: Joi.number(),
        emailConfirmed: Joi.boolean(),
        phoneNumberConfirmed: Joi.boolean(),
        userStatus: Joi.string(),
        userPanName: Joi.string(),
        userPanNumber: Joi.string(),
        created_Date: Joi.date(),
        lastModifiedDate: Joi.date(),
        userModifiedBy: Joi.string(),
        last_LoginDate: Joi.date(),
        activation_Date: Joi.date(),
        sex: Joi.string(),
        dob: Joi.date(),
        nationality: Joi.string(),
        deviceToken: Joi.string(),
        deviceID: Joi.string(),
        user_planType: Joi.number(),
        sales_In_Charge: Joi.boolean(),
        personalPanCardUpload: Joi.string(),
        resetToken: Joi.string()
      }).options({ allowUnknown: true }),

    userSchemaForgetPassword : Joi.object({
        email: Joi.string().email().required(),
    }),

    userSchemaResetPassword : Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
};

module.exports = schema;
