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

    userSchemaInsert : Joi.object({
        companyName: Joi.string().required(),
        parent: Joi.string(),
        type: Joi.string(),
        companyStatus: Joi.string(),
        modifiedBy: Joi.string(),
        logo_URL: Joi.string().uri(),
        office_Type: Joi.string(),
        isAutoInvoicing: Joi.boolean(),
        invoicingPackageName: Joi.string(),
        planType: Joi.string(),
        creditPlanType: Joi.string(),
        booking_Prefix: Joi.string(),
        invoicing_Prefix: Joi.string(),
        invoicingTemplate: Joi.string(),
        cin_number: Joi.string(),
        signature: Joi.string(),
        pan_Number: Joi.string(),
        HSN_SAC_Code: Joi.string(),
        hierarchy_Level: Joi.number().integer(),
        pan_upload: Joi.string().uri(),
        userType: Joi.string(),
        login_Id: Joi.string().email(),
        email: Joi.string().email(),
        title: Joi.string(),
        fname: Joi.string(),
        lastName: Joi.string(),
        password: Joi.string().min(6).required(),
        securityStamp: Joi.string(),
        phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
        twoFactorEnabled: Joi.boolean(),
        lockoutEnabled: Joi.boolean(),
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
        user_planType: Joi.string(),
        sales_In_Charge: Joi.string(),
        personalPanCardUpload: Joi.string().uri()
    }),
    userSchemaForgetPassword : Joi.object({
        email: Joi.string().email().required(),
    }),

    userSchemaResetPassword : Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })
};

module.exports = schema;
