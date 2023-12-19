const User = require("../../models/User");
const Company = require("../../models/Company");
const bcryptjs = require("bcryptjs");
const commonFunction = require("../commonFunctions/common.function");
const { Status } = require("../../utils/constants");
const Smtp = require("../../models/smtp");
const Role = require("../../models/Role");
const {TMC_ROLE ,DISTRIBUTER_ROLE,HOST_ROLE} = require("../../utils/constants");
const webMaster = require("../../models/WebsiteManager");
const Registration = require('../../models/Registration');
const CommercialAirPlan = require('../../models/CommercialAirPlan');
const agentConfigModel = require('../../models/AgentConfig');
const privilagePlanModel = require('../../models/PrivilagePlan');
const commercialPlanModel = require('../../models/CommercialAirPlan')


const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    console.log(req.body);

    if (!name || !email || !password || !mobile) {
      return {
        response: "All fields are required",
      };
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return {
        response: "Invalid email format",
      };
    }

    // Validate password strength (e.g., minimum length of 8 characters)
    if (password.length < 8) {
      return {
        response: "Password must be at least 8 characters long",
      };
    }

    const spassword = await commonFunction.securePassword(password);
    const newUser = new User({
      name,
      email,
      password: spassword,
      mobile,
    });

    const userData = await User.findOne({ email });

    if (userData) {
      return {
        response: "This email is already in use",
      };
    } else {
      const user_data = await newUser.save();
      return {
        response: "Registered Successfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    let user = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });
    if (!user) {
      return {
        response: "User not found",
      };
    }
    if (user.userStatus === Status.InActive || user.userStatus === Status.Inactive) {
      return {
        response: "User is not active",
      };
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        response: "Invalid password",
      };
    }
    const token = await commonFunction.createToken(user._id);
    const userDetails = {
      _id: user._id,
      name: `${user.fname}${user.lastName}`,
      email: user.email,
      phoneNumber: user.phoneNumber,
      companyId: user.company_ID,
      roleId : user?.roleId || null,
      token: token,
    };
    if(user.roleId){
      let userRoleName = await Role.findOne({})
    }
  console.log(userDetails)
    user = {
      ip_address : req.ip,
      last_LoginDate : new Date()
    }
    await User.findOneAndUpdate({ email: email}, user);
    return {
      response: "Login successful",
      data: userDetails,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const userInsert = async (req, res) => {
  let savedCompany = null;
 // console.log(req.user, "lllllllllllllllllllllllllllllllllllll")
  try {
    const requiredFields = [
      "companyName",
      "parent",
      "type",
      "companyStatus",
      "logo_URL",
      "isAutoInvoicing",
      "invoicingPackageName",
      "creditPlanType",
      // "booking_Prefix",
      // "invoicing_Prefix",
      // "invoicingTemplate",
      "cin_number",
      "signature",
      "pan_Number",
      "HSN_SAC_Code",
      "hierarchy_Level",
      "pan_upload",
      "login_Id",
      "email",
      "title",
      "fname",
      "lastName",
      "password",
      "securityStamp",
      "phoneNumber",
      "twoFactorEnabled",
      "lockoutEnabled",
      "emailConfirmed",
      "phoneNumberConfirmed",
      "userStatus",
      "userPanName",
      "userPanNumber",
      "sex",
      "dob",
      "nationality",
      "sales_In_Charge",
      "personalPanCardUpload",
      "roleId",
    ];

    const missingFields = requiredFields.filter(
      (fieldName) =>
        req.body[fieldName] === null || req.body[fieldName] === undefined
    );
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSometingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`,
      };
    };
    const {
      companyName,
      parent,
      type,
      companyStatus,
      logo_URL,
      office_Type,
      isAutoInvoicing,
      invoicingPackageName,
      planType,
      creditPlanType,
      booking_Prefix,
      invoicing_Prefix,
      invoicingTemplate,
      cin_number,
      signature,
      pan_Number,
      HSN_SAC_Code,
      hierarchy_Level,
      pan_upload,
      userType,
      login_Id,
      email,
      title,
      fname,
      lastName,
      password,
      securityStamp,
      phoneNumber,
      twoFactorEnabled,
      lockoutEnabled,
      emailConfirmed,
      phoneNumberConfirmed,
      userStatus,
      userPanName,
      userPanNumber,
      sex,
      dob,
      nationality,
      deviceToken,
      deviceID,
      user_planType,
      sales_In_Charge,
      personalPanCardUpload,
      roleId,
      gstState,
      gstPinCode,
      gstCity,
      gstNumber,
      gstName,
      gstAddress_1,
      gstAddress_2,
      isIATA,
      holdPnrAllowed,
      saleInChargeId,
      privillagePlanId,
      cityId,
      creditBalance,
      maxCreditLimit
    } = req.body;
   
    const existingUser = await User.findOne({ email });
    if (existingUser ) {
      return {
        response: "User with this email already exists",
        data: null
      };
    }
    
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return {
        response: "Company with this companyName already exists",
        data: null,
      };
    }
    console.log(req.user)
    const newCompany = new Company({
      companyName,
      parent,
      type,
      companyStatus,
      modifiedBy : req?.user?.id || null,
      logo_URL,
      office_Type,
      isAutoInvoicing,
      invoicingPackageName,
      planType,
      creditPlanType,
      booking_Prefix,
      invoicing_Prefix,
      invoicingTemplate,
      cin_number,
      signature,
      pan_Number,
      HSN_SAC_Code,
      hierarchy_Level,
      pan_upload,
      gstState: gstState || null,
      gstPinCode : gstPinCode || null,
      gstCity : gstCity || null,
      gstNumber : gstNumber || null,
      gstName : gstName || null,
      gstAddress_1 : gstAddress_1 || null,
      gstAddress_2 : gstAddress_2 || null,
      isIATA : isIATA || false,
      holdPnrAllowed : holdPnrAllowed || false
    });
    let createdComapanyId = newCompany._id;
    let findRole = await Role.findOne({_id : roleId })
  //  console.log(findRole.name, "=====================");
    if(findRole.name === HOST_ROLE.TMC){
      const rolesToInsert = [
        { name: TMC_ROLE.Agency, companyId:  newCompany._id, type: 'Default' },
        { name: TMC_ROLE.Distrbuter, companyId:  newCompany._id, type: 'Default' },
        { name: TMC_ROLE.Supplier, companyId:  newCompany._id, type: 'Default' }
      ];
      const insertedRoles = await Role.insertMany(rolesToInsert);
      console.log("Default Role Created Sucessfully")
    }
    if(findRole.name === HOST_ROLE.DISTRIBUTER ){
      const rolesToInsert = [
        { name: DISTRIBUTER_ROLE.Agency, companyId:  newCompany._id, type: 'Default' },
        { name: DISTRIBUTER_ROLE.Staff, companyId:  newCompany._id, type: 'Default' },
      ];
      const insertedRoles = await Role.insertMany(rolesToInsert);
      console.log("Default Role Created Sucessfully");
    }
    savedCompany = await newCompany.save();
    const securePassword = await commonFunction.securePassword(password);
    const newUser = new User({
      userType,
      login_Id,
      email,
      title,
      fname,
      lastName,
      password: securePassword,
      securityStamp,
      phoneNumber,
      twoFactorEnabled,
      lockoutEnabled,
      emailConfirmed,
      phoneNumberConfirmed,
      userStatus,
      userPanName,
      userPanNumber,
      sex,
      dob,
      nationality,
      deviceToken,
      deviceID,
      user_planType,
      sales_In_Charge,
      personalPanCardUpload,
      roleId,
      company_ID: savedCompany._id,
      modifiedBy : req.user.id || null, 
      cityId
    });

    let userCreated = await newUser.save();
    if(userCreated){
      await Registration.deleteOne({email : email});
      console.log("Registration details deleted");
    let privilegePlansIds = await privilagePlanModel.findOne({companyId :parent,IsDefault : true});
    let commercialPlanIds = await commercialPlanModel.findOne({companyId :parent,IsDefault : true});
    console.log(privilegePlansIds ,commercialPlanIds )
      let agentConfigsInsert = await agentConfigModel.create({
        userId : userCreated._id,
        companyId : savedCompany._id ,
        privilegePlansIds : privilegePlansIds || null,
        salesInchargeIds : saleInChargeId || null,
        maxcreditLimit : maxCreditLimit,
        holdPNRAllowed : holdPnrAllowed,
        commercialPlanIds : commercialPlanIds || null,
        modifyAt: new Date(),
        modifiedBy : req.user.id || null
        });
        agentConfigsInsert = await agentConfigsInsert.save();
      console.log( 'User Config Insert Sucessfully')
    }
    return {
      response: "User and Company Inserted successfully",
      data: { newUser, newCompany },
    };
  } catch (error) {
    if (savedCompany == null) {
      console.log(error);
      throw error;
    }else{
      await Company.deleteOne(savedCompany._id);
      console.log(error);
      throw error;
    }
   
  }
};

const forgotPassword = async (req, res) => {
  const { email, companyId } = req.body;
  try {
    // Find the user by email
    const resetToken = Math.random().toString(36).slice(2);
    // Find the user by email and update the reset token
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { resetToken } },
      { new: true }
    );
    if (!user) {
      return {
        response: "User not found",
      };
    }
    const comapnyIds = !companyId ? user?.company_ID : companyId;
    let mailConfig = await Smtp.findOne({ companyId : comapnyIds });
    // if not mailconfig then we send their parant mail config
    if(!mailConfig){
      let parentCompanyId = await Company.findById({_id : comapnyIds});
      parentCompanyId = parentCompanyId.parent;
      mailConfig = await Smtp.find({ companyId: parentCompanyId });
      mailConfig = mailConfig[0];
    }
    let basrUrl = await webMaster.findOne({companyId : comapnyIds});
    console.log(basrUrl, "llllllllllllllllllllllllllllllllllllll");
    basrUrl = basrUrl?.websiteURL || 'http://localhost:3111/api';
  // console.log(basrUrl, "nnnnnnnnnnnnnnnnnnnnnnn")
    const forgetPassWordMail = await commonFunction.sendPasswordResetEmail(
      email,
      resetToken,
      mailConfig,
      user,
      basrUrl
    );
    if (forgetPassWordMail.response == "Password reset email sent"||  forgetPassWordMail.data == true) {
      return {
        response: "Password reset email sent",
        data  : true
      };
    }
    else if(forgetPassWordMail.response === "forgetPassWordMail"){
      return {
      response : "Error sending password reset email"
        
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const varifyTokenForForgetPassword = async(req,res) => {
  try{
    let { userId , token } = req.query;
    let user = await User.findOne({ _id: userId, resetToken: token });
    if (!user) {
      return {
        response: "Invalid reset token",
      };
    }else{
      user = {
        resetToken  : "verify"
      }
      await User.findOneAndUpdate({ _id: userId}, user)
      return {
        response : "Token varified sucessfully"
      }
    }

  }catch(error){
    console.log(error);
    throw error
  }
}
const resetPassword = async (req, res) => {
  try {
    const { userId,  newPassword } = req.body;

    // Find the user by email and check the reset token
    const user = await User.findOne({ _id:userId , resetToken  : "verify"});
    if (!user) {
      return {
        response: "Inavalid User or User not found",
      };
      //  return res.status(401).json({ message: 'Invalid reset token' });
    }

    // Hash the new password
    const spassword = await commonFunction.securePassword(newPassword);
   // console.log(spassword);

    // Update the user's password and reset the resetToken
    await User.findOneAndUpdate(
      { _id : userId },
      { $set: { password: spassword, resetToken: null } }
    );
    console.log("password reset sucessfully");

    return {
      response: "Password reset successful",
    };
  } catch (error) {
    console.error(error);
    throw error
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const isCurrentPasswordIsValid = await commonFunction.comparePassword(
        currentPassword,
        user.password
      );
      if (isCurrentPasswordIsValid) {
        user.password = await commonFunction.securePassword(newPassword);
        await user.save();
        return {
          response: "Password Change Sucessfully",
        };
      } else {
        return {
          response: "Your current password is not valid",
        };
      }
    } else {
      return {
        response: "User for this mail-id not exist",
      };
    }
  } catch {
    console.log(error);
    throw error;
  }
};

const addUser = async (req,res) => {
  try{
    let requiredFeild = [
       'title',
       'firstName',
       'lastName',
       'email',
       'phoneNumber',
       'sales_In_Charge',
       'type',
       'password',
       'roleId'
    ];

    const missingFields = requiredFeild.filter(
    (fieldName) =>   req.body[fieldName] === null || req.body[fieldName] === undefined
    );
    if (missingFields.length > 0) {
      const missingFieldsString = missingFields.join(", ");
      return {
        response: null,
        isSometingMissing: true,
        data: `Missing or null fields: ${missingFieldsString}`,
      };
    };

    let { 
      title , 
      firstName , 
      lastName ,
      email, 
      phoneNumber, 
      sales_In_Charge ,
      isMailSent, 
      type,
      password,
      roleId
      } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          response: "User with this email already exists",
          data: null,
        };
      };

      let company = await User.findOne({_id: req.user._id});
      let companyId = company.company_ID;
      const securePassword = await commonFunction.securePassword(password);
      const newUser = new User({
        company_ID : companyId,
        title , 
        fname :firstName , 
        lastName ,
        email, 
        phoneNumber, 
        sales_In_Charge ,
        isMailSent, 
        type,
        password :securePassword,
        userStatus : "Active",
        roleId,

      });
      // Save the User document to the database
     let saveUser = await newUser.save();
     let companyName = await Company.findById(companyId);
     if(isMailSent == true){
      let mailText = {
        companyName, 
        firstName, 
        lastName, 
        mobile: phoneNumber, 
        email
      }
      let mailConfig = await Smtp.findOne({ companyId : companyId });
    // if not mailconfig then we send their parant mail config
    if(!mailConfig){
      let parentCompanyId = await Company.findById({_id : comapnyIds});
      parentCompanyId = parentCompanyId.parent;
      mailConfig = await Smtp.find({ companyId: parentCompanyId });
      mailConfig = mailConfig[0];
    }
    let mailSubject = 'User Created Sucessfully'
      let mailSend = await commonFunction.commonEmailFunction(email,mailConfig,mailText,mailSubject);
    }
     if(saveUser){
      return {
        response : 'New User Created Sucessfully',
        data : saveUser
      }
     }
     else{
        return {
          response : 'User Not created sucessfully'
        }
     }
  }catch(error){
     console.log(error);
     throw error
  }
};

const editUser = async (req,res) => {
  try{
    const userId = req.query.id;
    const updateData = req.body; 

    const updatedUserData = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if(updatedUserData){
      return {
        response : 'User details updated sucessfully',
        data : updatedUserData
      }
    }else{
      return {
        response : 'Failed to update User details'
      }
    }
  }catch(error){
     console.log(error);
     throw error
  }
}

const getUser = async (req,res) => {
  try{
  let {companyId} = req.query;
  let userData = await User.find({company_ID :companyId }).populate('roleId', 'name type').populate({
    path: 'company_ID',
    model: 'Company',
    select: 'companyName type cashBalance creditBalance maxCreditLimit updatedAt',
    populate: {
      path: 'parent',
      model: 'Company',
      select: 'companyName type'
    }
  }).populate('cityId')
  if(userData){
    return {
      response : 'User data found SucessFully',
      data : userData
    }
  }else{
     return {
      response : 'User data not found'
     }
  }
  
  }catch(error){
    console.log(error);
    throw error
  }
}

module.exports = {
  registerUser,
  loginUser,
  userInsert,
  forgotPassword,
  resetPassword,
  changePassword,
  varifyTokenForForgetPassword,
  addUser,
  editUser,
  getUser
};
