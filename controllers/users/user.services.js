const User = require("../../models/User");
const Company = require("../../models/Company");
const bcryptjs = require("bcryptjs");
const commonFunction = require("../commonFunctions/common.function");
const { Status } = require("../../utils/constants");
const Smtp = require("../../models/smtp");
const Role = require("../../models/Role");
const {TMC_ROLE ,DISTRIBUTER_ROLE,HOST_ROLE} = require("../../utils/constants");
const { response } = require("../../routes/registrationRoute");
const webMaster = require("../../models/WebsiteManager");


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
    console.log(req.ip, "=================>>>>>>>>>>>>>>>>>>>")

    // Find the user by email
    let user = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (!user) {
      return {
        response: "User not found",
      };
    }
    if (user.userStatus === Status.InActive) {
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
    let id = user._id;
    console.log(id)
    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      token: token,
    };
    // Password is valid; user is authenticated
    user = {
      ip_address : req.ip,
      last_LoginDate : new Date()
    }
    console.log(user, "{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}")
    await User.findOneAndUpdate({ email: email}, user);
  
    
 //  console.log(data, "PPPPPPPPPPPPPPPPPPPPPPPPP")
    return {
      response: "Login successful",
      data: userDetails,
    };
    //  res.status(200).json({ success: true, msg: "Login successful", data: userDetails });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const userInsert = async (req, res) => {
  try {
    // Define the required fields
    const requiredFields = [
      "companyName",
      "parent",
      "type",
      "companyStatus",
      "modifiedBy",
      "logo_URL",
      "office_Type",
      "isAutoInvoicing",
      "invoicingPackageName",
      "planType",
      "creditPlanType",
      "booking_Prefix",
      "invoicing_Prefix",
      "invoicingTemplate",
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
      "deviceToken",
      "deviceID",
      "user_planType",
      "sales_In_Charge",
      "personalPanCardUpload",
      "roleId",
    ];

    // Check for missing fields in the request body
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
    }

    // Destructure the request body
    const {
      companyName,
      parent,
      type,
      companyStatus,
      modifiedBy,
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
      created_Date,
      lastModifiedDate,
      userModifiedBy,
      last_LoginDate,
      activation_Date,
      sex,
      dob,
      nationality,
      deviceToken,
      deviceID,
      user_planType,
      sales_In_Charge,
      personalPanCardUpload,
      roleId
    } = req.body;
    
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        response: "User with this email already exists",
        data: null,
      };
    }
    
    // Check if a company with the same companyName already exists
    const existingCompany = await Company.findOne({ companyName });
    if (existingCompany) {
      return {
        response: "Company with this companyName already exists",
        data: null,
      };
    }

    // Create a new Company document
    const newCompany = new Company({
      companyName,
      parent,
      type,
      companyStatus,
      modifiedBy,
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
    });

    let createdComapanyId = newCompany._id;
    let findRole = await Role.findOne({_id : roleId })
    console.log(findRole.name, "=====================");
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
      console.log(insertedRoles);
      console.log("Default Role Created Sucessfully");
    }
    // Save the Company document to the database
    const savedCompany = await newCompany.save();
    const securePassword = await commonFunction.securePassword(password);
    // Create a new User document and associate it with the Company document
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
      company_ID: savedCompany._id, // Set the company_ID field to the _id of the saved Company document
    });

    // Save the User document to the database
    await newUser.save();
    return {
      response: "User and Company Inserted successfully",
      data: { newUser, newCompany },
    };
    // return res.status(200).json({ success: true, msg: 'User and Company Inserted successfully', data: newUser });
  } catch (error) {
    if (savedCompany) {
      await Company.findByIdAndRemove(savedCompany._id);
    }
    console.log(error);
    throw error;
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
    let basrUrl = await webMaster.findOne({companyId : comapnyIds})
    basrUrl = basrUrl.websiteURL;
   // console.log(mailConfig, "================>>>>>>>>>>>>>>>>");
    // Send a password reset email to the user

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
    const { email,  newPassword } = req.body;

    // Find the user by email and check the reset token
    const user = await User.findOne({ email: email, resetToken  : "verify"});
    if (!user) {
      return {
        response: "Inavalid User or User not found",
      };
      //  return res.status(401).json({ message: 'Invalid reset token' });
    }

    // Hash the new password
    const spassword = await commonFunction.securePassword(newPassword);
    console.log(spassword);

    // Update the user's password and reset the resetToken
    await User.findOneAndUpdate(
      { email },
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
   // console.log(req.user, "<<<<<<<<<<<<++++++++++++++++>>>>>>>>>>>>>>>>>>>>>>");
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

   //  console.log(companyId, "<<<<<<<<<+++++++++++++++>>>>>>>>>>>>>>..")
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
        roleId
      });
      // Save the User document to the database
     let saveUser = await newUser.save();
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
    if(updatedBankDetails){
      return {
        response : 'Bank details updated sucessfully',
        data : updatedUserData
      }
    }else{
      return {
        response : 'Failed to update bank details'
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
  editUser
};
