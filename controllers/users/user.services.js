const User = require("../../models/User");
const Company = require("../../models/Company");
const commonFunction = require("../commonFunctions/common.function");
const { Status } = require("../../utils/constants");
const Smtp = require("../../models/Smtp");
const Role = require("../../models/Role");
const { TMC_ROLE, DISTRIBUTER_ROLE, HOST_ROLE } = require("../../utils/constants");
const webMaster = require("../../models/WebsiteManager");
const Registration = require('../../models/Registration');
const agentConfigModel = require('../../models/AgentConfig');
const privilagePlanModel = require('../../models/PrivilagePlan');
const plbGroupModel = require('../../models/PLBGroupMaster');
const incentiveGroupModel = require('../../models/IncentiveGroupMaster');
const airlinePromocodeModel = require('../../models/AirlinePromoCodeGroup');
const paymentGatewayModel = require('../../models/paymentGatewayChargesGroup');
const ssrCommercialGroupModel = require('../../models/SsrCommercialGroup');
const commercialPlanModel = require('../../models/CommercialAirPlan');
const fareRuleGroupModel = require('../../models/FareRuleGroup');
const agencyGroupModel = require('../../models/AgencyGroup');
const { response } = require("../../routes/userRoute");
const { Config } = require("../../configs/config");
const agencyGroupServices = require("../../controllers/agencyGroup/agencyGroup.services");
const { status } = require("../../utils/commonResponce");
const bcrypt = require('bcryptjs');
const mongoose=require('mongoose')

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
    let userId = isNaN(email) ? null :parseInt(email);
    let data = await User.find();
    let user = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber },{ userId: userId }],
    }).populate("roleId");
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
    const isPasswordValid = await user.isPasswordCorrect(password)
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
      roleId: user?.roleId?._id || null,
      userType: user?.roleId?.name || null,
      token: token,
      lastLogin: user?.last_LoginDate || new Date(),
      userId: user?.userId || "",
      encryptUserId: user?.encryptUserId || {}
    };
    if (user.roleId) {
      let userRoleName = await Role.findOne({})
    }
    // console.log(userDetails)
    user = {
      ip_address: req.ip,
      last_LoginDate: new Date()
    }
    await User.findOneAndUpdate({ email: email }, user);
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
  let newUser = null;
  try {
    const requiredFields = [
      "companyName",
      "parent",
      "companyStatus",
      "pan_Number",
      "login_Id",
      "email",
      "fname",
      "lastName",
      "phoneNumber",
      "userStatus",
      // "userPanName",
      // "userPanNumber",
      "nationality",
      "sales_In_Charge",
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
    let {
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
      cityId,
      creditBalance,
      maxCreditLimit,
      agencyGroupId,
      adhar_Detail,
      adhar_Number
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        response: "User with this email already exists",
        data: null
      };
    }
    
    let findRole = await Role.findOne({ _id: roleId })
    if (!type) {
      type = findRole?.name || null
    }
    const newCompany = new Company({
      companyName,
      parent,
      type,
      companyStatus,
      modifiedBy: req?.user?.id || null,
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
      gstPinCode: gstPinCode || null,
      gstCity: gstCity || null,
      gstNumber: gstNumber || null,
      gstName: gstName || null,
      gstAddress_1: gstAddress_1 || null,
      gstAddress_2: gstAddress_2 || null,
      isIATA: isIATA || false,
      holdPnrAllowed: holdPnrAllowed || false,
    });
    let createdComapanyId = newCompany._id;
    savedCompany = await newCompany.save();
    // console.log(createdComapanyId, "=====================");
    if (findRole?.name === HOST_ROLE.TMC) {
      const rolesToInsert = [
        { name: TMC_ROLE.Agency, companyId: newCompany._id, type: 'Default' },
        { name: TMC_ROLE.Distrbuter, companyId: newCompany._id, type: 'Default' },
        { name: TMC_ROLE.Supplier, companyId: newCompany._id, type: 'Default' }
      ];
      const insertedRoles = await Role.insertMany(rolesToInsert);
      console.log("Default Role Created Sucessfully")
    }
    if (findRole?.name === HOST_ROLE.DISTRIBUTER) {
      let createDefaultDistributerGroup = await agencyGroupServices.createDefaultDistributerGroup(savedCompany._id, true, savedCompany.companyName);
      const rolesToInsert = [
        { name: DISTRIBUTER_ROLE.Agency, companyId: newCompany._id, type: 'Default' },
        { name: DISTRIBUTER_ROLE.Staff, companyId: newCompany._id, type: 'Manual' },
      ];
      const insertedRoles = await Role.insertMany(rolesToInsert);
      console.log("Default Role Created Sucessfully");
    }
    if (password == null || password == undefined) {
      password = commonFunction.generateRandomPassword(10)
    }
    ///const securePassword = await commonFunction.securePassword(password);
    const resetToken = Math.random().toString(36).slice(2);
    newUser = new User({
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
      company_ID: savedCompany._id,
      modifiedBy: req?.user?.id || null,
      cityId,
      adhar_Detail,
      adhar_Number,
      resetToken: resetToken
    });

    let userCreated = await newUser.save();
    let mailConfig = await Smtp.findOne({ companyId: parent });
    if (!mailConfig) {
      let id = Config.MAIL_CONFIG_ID;
      mailConfig = await Smtp.findById(id);
    };
    let baseUrl = await webMaster.findOne({ companyId: savedCompany._id });
    if (!baseUrl) {
      // let cId = '6555f84c991eaa63cb171a9f'
      baseUrl = await webMaster.find({ companyId: savedCompany._id });
      baseUrl = baseUrl.length > 0 ? baseUrl[0]?.websiteURL : 'https://agent.kafilaholidays.in';
    }
    if (userCreated) {
      // let resetTempPassword = await commonFunction.sendPasswordResetEmailLink(
      //   email,
      //   resetToken,
      //   mailConfig,
      //   newUser,
      //   password,
      //   baseUrl
      // );
      // if (resetTempPassword.response == "Password reset email sent" || resetTempPassword.data == true) {
      //   console.log("Password reset email sent");
      // }
      // else if (resetTempPassword.response === "forgetPassWordMail") {
      //   console.log("Error sending password reset email");
      // }
      let privilegePlansIds = await privilagePlanModel.findOne({ companyId: parent, IsDefault: true });
      let commercialPlanIds = await commercialPlanModel.findOne({ companyId: parent, IsDefault: true });
      let fareRuleGroupIds = await fareRuleGroupModel.findOne({ companyId: parent, IsDefault: true });
      let plbGroupIds = await plbGroupModel.findOne({ companyId: parent, IsDefault: true });
      let incentiveGroupIds = await incentiveGroupModel.findOne({ companyId: parent, IsDefault: true });
      let airlinePromocodeIds = await airlinePromocodeModel.findOne({ companyId: parent, IsDefault: true });
      let paymentGatewayIds = await paymentGatewayModel.findOne({ companyId: parent, IsDefault: true });
      let ssrCommercialGroupId = await ssrCommercialGroupModel.findOne({ companyId: parent, IsDefault: true });

      if (!agencyGroupId) {
        // check agency parent is distributer or TMC
        let findParentRoleId = await User.findOne({ company_ID: parent });
        let findParentRole = await Role.findOne({ _id: findParentRoleId.roleId });
        if (findParentRole.name == "TMC") {
          // if agencyParent is tmc then find agencyGroup by their parentCompany id and isdefault true and assign that agent
          agencyGroupId = await agencyGroupModel.findOne({ companyId: parent, isDefault: true });
        } else if (findParentRole.name == "Distributer") {
          // if agencyParent is distributer then find agencyGroup by their distributerparent and assign that agency
          agencyGroupId = await agencyGroupModel.findOne({ companyId: parent, isDefault: true });
        } else {
          agencyGroupId = await agencyGroupModel.findOne({ isDefault: true });
        }
      } else {
        let findParentRoleId = await User.findOne({ company_ID: parent });
        let findParentRole = await Role.findOne({ _id: findParentRoleId.roleId });
        if (findParentRole.name == "TMC") {
          // if agencyParent is tmc then find agencyGroup by their parentCompany id and isdefault true and assign that agent
          agencyGroupId = await agencyGroupModel.findOne({ companyId: parent, isDefault: true });
        } else if (findParentRole.name == "Distributer") {
          // if agencyParent is distributer then find agencyGroup by their distributerparent and assign that agency
          agencyGroupId = await agencyGroupModel.findOne({ companyId: parent, isDefault: true });
        } else {
          agencyGroupId = await agencyGroupModel.findOne({ _id: agencyGroupId });
        }
      };

      //  console.log(privilegePlansIds ,commercialPlanIds ,fareRuleGroupIds,agencyGroupId)
      let agentConfigsInsert = await agentConfigModel.create({
        userId: userCreated._id,
        companyId: savedCompany._id,
        salesInchargeIds: saleInChargeId || null,
        maxcreditLimit: maxCreditLimit,
        holdPNRAllowed: holdPnrAllowed,
        commercialPlanIds: agencyGroupId?.commercialPlanId || null,
        privilegePlansIds: agencyGroupId?.privilagePlanId || null,
        fareRuleGroupIds: agencyGroupId?.fareRuleGroupId || null,
        plbGroupIds: agencyGroupId?.plbGroupId || null,
        incentiveGroupIds: agencyGroupId?.incentiveGroupId || null,
        airlinePromocodeIds: agencyGroupId?.airlinePromoCodeGroupId || null,
        paymentGatewayIds: agencyGroupId?.pgChargesGroupId || null,
        ssrCommercialGroupId: agencyGroupId?.ssrCommercialGroupId || null,
        diSetupIds: agencyGroupId?.diSetupGroupId || null,
        modifyAt: new Date(),
        modifiedBy: req?.user?.id || null,
        agencyGroupId: agencyGroupId,
        initiallyLoad: "Fight Search",
        acencyLogoOnTicketCopy: true,
        addressOnTicketCopy: true,
        holdPNRAllowed: true,
        portalLedgerAllowed: true,
        fareTypes: ["NDF", "CPNS1", "CPN", "MAIN", "CDF", "SME", "CPNS", "CRCT", "CRCT1", "FD", "FF", "TBF"],
      });
      agentConfigsInsert = await agentConfigsInsert.save();
      console.log('User Config Insert Sucessfully');
      await Registration.deleteOne({ email: email });
      //console.log("Registration details deleted");
    }
    return {
      response: "User and Company Inserted successfully",
      data: { newUser, newCompany },
    };
  } catch (error) {
    if (savedCompany == null || newUser == null) {
      console.log(error);
      throw error;
    } else {
      await Company.deleteOne(savedCompany._id);
      await User.deleteOne(newUser._id);
      console.log(error);
      throw error;
    }

  }
};
const forgotPassword = async (req, res) => {
  const { email, companyId } = req.body;
  try {
    const resetToken = Math.random().toString(36).slice(2);
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

    let mailConfig = await Smtp.findOne({ companyId: comapnyIds });
    if (!mailConfig) {
      let parentCompanyId = await Company.findById({ _id: comapnyIds });
      parentCompanyId = parentCompanyId.parent;
      mailConfig = await Smtp.find({ companyId: parentCompanyId });
      mailConfig = mailConfig[0];
    }
    let baseUrl = await webMaster.find({ companyId: comapnyIds });
    if (!baseUrl) {
      let cId = '6555f84c991eaa63cb171a9f'
      baseUrl = await webMaster.find({ companyId: cId });
    };
    baseUrl = Config.MODE=="TEST"? Config.TEST.baseURL : Config.LIVE.baseURL;
    const forgetPassWordMail = await commonFunction.sendPasswordResetEmail(
      email,
      resetToken,
      mailConfig,
      user,
      baseUrl
    );
    if (forgetPassWordMail.response == "Password reset email sent" || forgetPassWordMail.data == true) {
      return {
        response: "Password reset email sent",
        data: true
      };
    }
    else if (forgetPassWordMail.response === "forgetPassWordMail") {
      return {
        response: "Error sending password reset email"
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const varifyTokenForForgetPassword = async (req, res) => {
  try {
    let { userId, token } = req.query;
    let user = await User.findOne({ _id: userId, resetToken: token });
    if (!user) {
      return {
        response: "Invalid reset token",
      };
    } else {
      user = {
        resetToken: "verify"
      }
      await User.findOneAndUpdate({ _id: userId }, user)
      return {
        response: "Token varified sucessfully"
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
};
const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword, oldPassword } = req.body;
    let user = await User.findOne({ _id: userId, resetToken: "verify" });
    if (!user) {
      return {
        response: "Inavalid User or User not found",
      };
    };

    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    //  const spassword = await commonFunction.securePassword(newPassword);
    // await User.findOneAndUpdate(
    //   { _id : userId },
    //   { $set: { password: spassword, resetToken: null } }
    // );
    // console.log("password reset sucessfully");

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
    let { currentPassword, newPassword, email, id, parentId } = req.body;
    let user = await User.findOne({ $or: [{ email: email }, { _id: id }] });
    if (user) {
      if (currentPassword) {
        const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
        if (!isPasswordCorrect) {
          return {
            response: 'Invalid Current Password'
          }
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: false });
        return {
          response: 'Password Change Sucessfully'
        }
      } else {
        let findUser = await User.findById(parentId);
        let findRole = await Role.findOne({ _id: findUser?.roleId });
        if (findRole?.name == 'TMC' || findRole?.name == 'Distributer' || findRole?.name == 'Distributor' || findRole?.name == 'Supplier') {
          user.password = newPassword;
          await user.save({ validateBeforeSave: false });
          return {
            response: 'Password Change Sucessfully'
          }
        } else {
          return {
            response: 'User Dont Have Permision To Chnage Password Without Current Password'
          }
        }
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
const addUser = async (req, res) => {
  try {
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
      (fieldName) => req.body[fieldName] === null || req.body[fieldName] === undefined
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
      title,
      firstName,
      lastName,
      email,
      phoneNumber,
      sales_In_Charge,
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

    let company = await User.findOne({ _id: req.user._id });
    let companyId = company.company_ID;
    // const securePassword = await commonFunction.securePassword(password);
    const newUser = new User({
      company_ID: companyId,
      title,
      fname: firstName,
      lastName,
      email,
      phoneNumber,
      sales_In_Charge,
      isMailSent,
      type,
      password,
      userStatus: "Active",
      roleId,

    });
    // Save the User document to the database
    let saveUser = await newUser.save();
    let companyName = await Company.findById(companyId);
    if (isMailSent == true) {
      let mailText = {
        companyName,
        firstName,
        lastName,
        mobile: phoneNumber,
        email
      }
      let mailConfig = await Smtp.findOne({ companyId: companyId });
      // if not mailconfig then we send their parant mail config
      if (!mailConfig) {
        let parentCompanyId = await Company.findById({ _id: companyId });
        parentCompanyId = parentCompanyId.parent;
        mailConfig = await Smtp.find({ companyId: parentCompanyId });
        mailConfig = mailConfig[0];
      }
      let mailSubject = 'User Created Sucessfully'
      let mailSend = await commonFunction.commonEmailFunction(email, mailConfig, mailText, mailSubject);
    }
    if (saveUser) {
      return {
        response: 'New User Created Sucessfully',
        data: saveUser
      }
    }
    else {
      return {
        response: 'User Not created sucessfully'
      }
    }
  } catch (error) {
    console.log(error);
    throw error
  }
};
const editUser = async (req, res) => {
  try {
    const userId = req.query.id;
    const updateData = req.body;
    const findUserData = await User.findById(userId)

    if (updateData.password !== findUserData.password) {
      const spassword = await commonFunction.securePassword(updateData?.password);
      updateData.password = spassword
    } else {

      updateData.password = findUserData.password
    }
    const updatedUserData = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (updatedUserData) {
      return {
        response: 'User details updated sucessfully',
        data: updatedUserData
      }
    } else {
      return {
        response: 'Failed to update User details'
      }
    }
  } catch (error) {
    console.log(error);
    throw error
  }
};
const getUser = async (req, res) => {
  try {
    let { companyId } = req.query;
    let userData = await User.find({ company_ID: companyId }).populate('roleId', 'name type').populate({
      path: 'company_ID',
      model: 'Company',
      select: 'companyName type cashBalance creditBalance maxCreditLimit updatedAt',
      populate: {
        path: 'parent',
        model: 'Company',
        select: 'companyName type'
      }
    }).populate('cityId')
    if (userData) {
      return {
        response: 'User data found SucessFully',
        data: userData
      }
    } else {
      return {
        response: 'User data not found'
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
};
const getAllAgencyAndDistributer = async (req, res) => {
  try {
    let parentId = req.query.id;
    let agency

    const findTmcUser=await Company.findById(parentId)
    if(findTmcUser.type !="TMC"){
      agency = await Company.find({
        $or: [
          { parent: parentId },
          { _id: parentId }
        ]
      })
  
    }
    else{
      agency = await Company.find()
   }

   
    if (agency.length == 0) {
      return {
        response: 'No Agency with this TMC'
      }
    }

    const ids = agency.map(item =>new mongoose.Types.ObjectId(item._id));
    const users = await User.aggregate([
      { $match: { company_ID: { $in: ids } } },
      { 
        $lookup: {
          from: 'roles', // Name of the roles collection
          localField: 'roleId',
          foreignField: '_id',
          as: 'roleId'
        }
      },
      { 
        $unwind: {
          path: '$roleId',
          preserveNullAndEmptyArrays: true
        }
      },
      { 
        $lookup: {
          from: 'cities', // Name of the cities collection
          localField: 'cityId',
          foreignField: '_id',
          as: 'cityId'
        }
      },
      { 
        $unwind: {
          path: '$cityId',
          preserveNullAndEmptyArrays: true
        }
      },
      { 
        $lookup: {
          from: 'companies', // Name of the companies collection
          localField: 'company_ID',
          foreignField: '_id',
          as: 'company_ID'
        }
      },
      { 
        $unwind: {
          path: '$company_ID',
          preserveNullAndEmptyArrays: true
        }
      },
      { 
        $lookup: {
          from: 'companies',
          localField: 'company_ID.parent',
          foreignField: '_id',
          as: 'company_ID.parent'
        }
      },
      { 
        $unwind: {
          path: '$company_ID.parent',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:{
          from:'agentconfigurations',
          localField:'_id',
          foreignField:"userId",
          as:"salesIncharge"

        },
      },
      { 
        $unwind: {
          path: '$salesIncharge',
          preserveNullAndEmptyArrays: true
        }
      },
      { 
        $lookup: {
          from: 'users',
          localField: 'salesIncharge.salesInchargeIds',
          foreignField: '_id',
          as: 'salesInchargeData'
        }
      },
      { $unwind: { path: '$salesInchargeData', preserveNullAndEmptyArrays: true } },
      {
        $lookup:{
          from:"agentconfigurations",
          localField:"_id",
          foreignField:"userId",
          as:"agentconfigurations"

        }
      },
      {$unwind:{path:"$agentconfigurations" ,preserveNullAndEmptyArrays: true}},
      
      {
        $group: {
          _id: "$_id",
          company_ID: {
            $first: {
              _id: "$company_ID._id",
              companyName: "$company_ID.companyName",
              type: "$company_ID.type",
              companyStatus: "$company_ID.companyStatus",
              cashBalance: "$company_ID.cashBalance",
              creditBalance: "$company_ID.creditBalance",
              maxCreditLimit: "$company_ID.maxCreditLimit",
              updatedAt: "$company_ID.updatedAt",
              parent: {
                _id: "$company_ID.parent._id",
                companyName: "$company_ID.parent.companyName",
                type: "$company_ID.parent.type"
              }
          
          }},
          salesIncharge: { $first: "$salesIncharge.salesInchargeIds" },
          salesInchargeData:{$first:{ fname:  "$salesInchargeData.fname" ,
          lastName:  "$salesInchargeData.lastName",
          title: "$salesInchargeData.title" }},

         userType: { $first: "$userType" },
          login_Id: { $first: "$login_Id" },
          email: { $first: "$email" },
          deactivation_Date: { $first: "$deactivation_Date" },
          logoURI: { $first: "$logoURI" },
          roleId: { $first: "$roleId" },
          title: { $first: "$title" },
          fname: { $first: "$fname" },
          lastName: { $first: "$lastName" },
          password: { $first: "$password" },
          securityStamp: { $first: "$securityStamp" },
          phoneNumber: { $first: "$phoneNumber" },
          twoFactorEnabled: { $first: "$twoFactorEnabled" },
          lockoutEnabled: { $first: "$lockoutEnabled" },
          accessfailedCount: { $first: "$accessfailedCount" },
          emailConfirmed: { $first: "$emailConfirmed" },
          phoneNumberConfirmed: { $first: "$phoneNumberConfirmed" },
          userStatus: { $first: "$userStatus" },
          userPanName: { $first: "$userPanName" },
          userPanNumber: { $first: "$userPanNumber" },
          sex: { $first: "$sex" },
          dob: { $first: "$dob" },
          nationality: { $first: "$nationality" },
          deviceToken: { $first: "$deviceToken" },
          deviceID: { $first: "$deviceID" },
          user_planType: { $first: "$user_planType" },
          sales_In_Charge: { $first: "$sales_In_Charge" },
          personalPanCardUpload: { $first: "$personalPanCardUpload" },
          created_Date: { $first: "$created_Date" },
          lastModifiedDate: { $first: "$lastModifiedDate" },
          last_LoginDate: { $first: "$last_LoginDate" },
          activation_Date: { $first: "$activation_Date" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          resetToken: { $first: "$resetToken" },
          ip_address: { $first: "$ip_address" },
          userId: { $first: "$userId" },
          encryptUserId: { $first: "$encryptUserId" },
          maxcreditLimit: { $first: "$agentconfigurations.maxcreditLimit" },
          agentConfigID: { $first: "$agentconfigurations._id" }
        }
      },
      
      {$sort:{userId:1}},
      
      
    ])
    
    //console.log("=======>>>", users);
   
    let data = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].roleId.type == 'Manual') {
        continue;
      } else {
        data.push(users[i])
      }
    }
    if (users.length != 0) {
      return {
        response: 'Agency Data fetch Sucessfully',
        data: data
      }
    } else {
      return {
        response: 'Agency Data not found'
      }
    }

  } catch (error) {
    console.log(error);
    throw error
  }
};

const updateUserStatus = async (req, res) => {
  try {

    const { userId, status } = req.query

    if (!userId || !status) {
      return {
        response: null,
        message: "user Id not true",
      };
    };


    const result = await Company.findByIdAndUpdate({ _id: userId }, { companyStatus: status }, { new: true })

    if (result) {
      return {
        response: 'Upate Successfully',
      }
    } else {
      return {
        response: 'User data not found'
      }
    }


  }
  catch (error) {
    throw error
  }
}

const getCompanyProfle = async (req, res) => {
  try {
    const { companyId } = req.body
    if (!companyId) {
      return {
        response: null,
        message: "companyId not true"

      }
    }

    const CompanyProfileData = await Company.findById(companyId).populate("parent", "companyName type")
    if (CompanyProfileData) {
      return {
        response: "Company data find successfull",
        data: CompanyProfileData
      }
    }
    else {
      return {
        response: "Company Data not Found"
      }
    }

  } catch (error) {
    throw error
  }
}

const updateCompayProfile = async (req, res) => {
  try {
    const { companyId } = req.query
    if (!companyId) {
      return {
        response: null,
        message: "companyId not true"

      }
    }

    const companyData = await Company.findById(companyId)
      const updateCompayProfile = await Company.findByIdAndUpdate(
        companyId,
        {
          $set: {
            gst_URL: req.files.gst_URL ? req.files.gst_URL[0].path : companyData.gst_URL,
            panUpload_URL: req.files.panUpload_URL ? req.files.panUpload_URL[0].path : companyData.panUpload_URL,
            logoDocument_URL: req.files.logoDocument_URL ? req.files.logoDocument_URL[0].path : companyData.logoDocument_URL,
            signature_URL: req.files.signature_URL ? req.files.signature_URL[0].path : companyData.signature_URL,
            aadhar_URL: req.files.aadhar_URL ? req.files.aadhar_URL[0].path : companyData.aadhar_URL,
            agencyLogo_URL: req.files.agencyLogo_URL ? req.files.agencyLogo_URL[0].path : companyData.agencyLogo_URL
          }
        },
        { new: true }
      );

      if (updateCompayProfile) {
        return {
          response: "company data succefully update",
          data: updateCompayProfile
        }
      }

      else {
        return {
          response: "company data not update"
        }
      }



    }

  
   catch (error) {
    throw error
  }
}

const agencyChangePassword = async (req, res) => {
  try {
    const { id, newPassword,email,railSubAgentId,railSubAgentPassword} = req.body;
    var message=""

if(railSubAgentId||railSubAgentPassword){
  if(railSubAgentId&&railSubAgentId!==undefined){
    message="RailSubAgentId"
  }

if(railSubAgentPassword&&railSubAgentPassword!==undefined){
    message='SubAgentPassword'
  }
const AgencyData=await agentConfigModel.findOne({userId:id})

  const payloadObj={railSubAgentId:railSubAgentId?railSubAgentId:AgencyData.railSubAgentId,railSubAgentPassword:railSubAgentPassword?railSubAgentPassword:AgencyData.railSubAgentPassword};
  await agentConfigModel.findByIdAndUpdate(AgencyData._id,{$set:payloadObj},{new:true})

}else{

let getUserByCompanyId = await User.findOne({ _id: id });
    if (!getUserByCompanyId) {
      return { response: "User doesn't exist" }
    }
        if(newPassword!==undefined){
message="Password"
   var  hashedPassword = await bcrypt.hash(newPassword, 10);
  }
  if(email&&email!==undefined){
    message="Email"
  }
 
    const UserExist=await User.findOne({email:email})
    if(UserExist){
return({
  response:"User email already exist"
})
    }
    
    const userData=await User.findById(id)
    const payload={ password: hashedPassword?hashedPassword:userData.password,email:email?email:userData.email,login_Id:email?email:userData.login_Id}
    await User.findOneAndUpdate({ _id: id }, { $set: payload });

  }
    return {
      response: `${message} Changed Sucessfully`
    };
  } catch (error) {
    console.log(error)
    throw error
  }
}

const userFindEncrypted=async(req,res)=>{
  try{
    const {encryptedText}=req.query;
if(!encryptedText){
  return{
    response:"encrypted Id not find"
  }

}
const userDetail=await User.find({"encryptUserId.encryptedText":encryptedText}).populate({path:'company_ID' , select:"companyName type companyStatus pan_Number gstNumber",populate:{path:"parent",select:"companyName type"}})
if(!userDetail){
  return{
    response:"userData not found"
  }
}

return {
  response:"userData found Sucessfully",
  data:userDetail
}

  }
  catch(error){
    throw error
  }
}

const searchForAgency = async (req, res) => {
  try {
    const { companyId, search, userId } = req.query;

    const getUserId = await User.findOne({ _id: userId, roleId: { $exists: true, $ne: null } });

    const searchRegex = new RegExp(search, 'i');
    const searchNumber = new RegExp(userId, 'i');

    const matchConditions = [];

    if (!isNaN(searchNumber)) {
      matchConditions.push({ "userData.userId": searchNumber });
      console.log("shaa")
    }

    matchConditions.push({ 'companyData.companyName': searchRegex });

    //if(getRole.name == 'TMC' || getRole.name == 'Distributer' || getRole.name == 'Supplier') {
    const getCompaniesDetails = await User.aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'company_ID',
          foreignField: '_id',
          as: 'companyData'
        }
      },
      { $unwind: { path: '$companyData', preserveNullAndEmptyArrays: true } },

      {$lookup:{
        from:"roles",
        localField:"roleId",
        foreignField:"_id",
        as:"roleId"
      }},

      {$unwind:{path:"$roleId",preserveNullAndEmptyArrays:true}},

      {$match:{"roleId.type":"Default"}},

      {
        $addFields: {
          userIdString: { $toString: '$userId' }
        }
      },
      {
        $match: {
          'companyData.parent': getUserId.company_ID,
          $or: [{ userIdString: new RegExp(search, 'i') },
          { 'companyData.companyName': new RegExp(search, 'i') }
          ]
        }
      }, {
        $group: {
          _id: "$companyData._id",
          companyName: { $first: "$companyData.companyName" },
        }
      }

    ]);
    console.log(getCompaniesDetails)
    let companiesList = [];
    for (let i = 0; i < getCompaniesDetails.length; i++) {
      const companyDetails = getCompaniesDetails[i];
      const populatedCompanyDetails = await User.findOne({ company_ID: companyDetails?._id, userStatus: "Active" });

      // Check if populatedCompanyDetails exists before trying to access _id
      if (populatedCompanyDetails) {
        companiesList.push({ _id: populatedCompanyDetails?._id, name: companyDetails?.companyName, userId: populatedCompanyDetails?.userId ,company_ID:populatedCompanyDetails.company_ID});
      }

    }

    const getUserDetails = await User.aggregate([
      {
        $match: {
          company_ID: getUserId.company_ID,
        }
      },
      {$lookup:{
        from:"roles",
        localField:"roleId",
        foreignField:"_id",
        as:"roleId"
      }},

      {$unwind:{path:"$roleId",preserveNullAndEmptyArrays:true}},

      {$match:{"roleId.type":"Default"}},


      {
        $addFields: {
          userIdString: { $toString: "$userId" }
        }
      },
      {
        $match: {
          $or: [
            { fname: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { userIdString: new RegExp(search, 'i') }
          ]
        }
      }
    ]);

    for (let i = 0; i < getUserDetails.length; i++) {
      const userDetails = getUserDetails[i];
      companiesList.push({ _id: userDetails?._id, name: userDetails?.fname + ' ' + userDetails?.lastName, userId: userDetails?.userId });
    }
    //console.log(companiesList)   

    //const getUserDetails = await UserModule.findOne({ company_ID : getUserId.company_ID });

    //  return false
    if (companiesList.length > 0) {
      return {
        data: companiesList
      };
    } else {
      return {
        data: []
      };
    }
    //}else{
    // const result = await UserModule.find({
    //     companyId: companyId,
    //     $or: [
    //         { fname: new RegExp(search, 'i') },
    //         { lname: new RegExp(search, 'i') },
    //     ]
    // });

    // if (result.length > 0) {
    //     return {
    //         data: result
    //     };
    // } else {
    //     return {
    //         data: []
    //     };
    // }
    //}

  } catch (error) {
    console.log(error)
    throw error;
  }
};

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
  getUser,
  getAllAgencyAndDistributer,
  updateUserStatus,
  getCompanyProfle,
  updateCompayProfile,
  agencyChangePassword,
  userFindEncrypted,
  searchForAgency
};
