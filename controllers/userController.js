
const User = require("../models/User");
const Company = require("../models/Company");
const bcryptjs = require("bcryptjs");
const { Config } = require("../configs/config");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
 const createToken = async (id) => {
    try {
       const token = await jwt.sign({_id:id},Config.SECRET_JWT);
       return token;
    } catch (error) {
        return error.message;
    }
 }
const securePassword = async (password) => {
    try {
        const passwordhash = await bcryptjs.hash(password, 10);
        return passwordhash;
    } catch (error) {
        return error.message;
    }
}

const registerUser = async (req, res) => {
    try {        
        // Validate the request body
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({ success: false, msg: "All fields are required", data: null });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, msg: "Invalid email format", data: null });
        }

        // Validate password strength (e.g., minimum length of 8 characters)
        if (password.length < 8) {
            return res.status(400).json({ success: false, msg: "Password must be at least 8 characters long", data: null });
        }

        const spassword = await securePassword(password);
        const newUser = new User({ 
            name,
            email,
            password: spassword,
            mobile
            
        });

        const userData = await User.findOne({ email });

        if (userData) {
            return res.status(400).json({ success: false, msg: "This email is already in use", data: null });
        } else {
            const user_data = await newUser.save(); 
            return res.status(200).json({ success: true, msg: "Registered Successfully!", data: user_data });
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: "abc" });
    }
}


const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ success: false, msg: errors.array(), data: null });
        }
        const { email, password } = req.body;
        
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, msg: "User not found", data: null });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, msg: "Invalid password", data: null });
        }
        const token = await createToken(user._id);
        const userDetails = {
            _id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber,
            token:token            
        }
        // Password is valid; user is authenticated
        res.status(200).json({ success: true, msg: "Login successful", data: userDetails });
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message, data: null });
    }
}

const userInsert = async (req, res) => {
    try {
      // Define the required fields
      const requiredFields = [
        "companyName", "parent", "type", "companyStatus", "modifiedBy", "logo_URL",
        "office_Type", "isAutoInvoicing", "invoicingPackageName", "planType", "creditPlanType", "booking_Prefix",
        "invoicing_Prefix", "invoicingTemplate", "cin_number", "signature",
        "pan_Number", "HSN_SAC_Code", "hierarchy_Level", "pan_upload", "userType", "login_Id",
        "email", "title", "fname",
        "lastName", "password", "securityStamp", "phoneNumber",
        "twoFactorEnabled", "lockoutEnabled",
        "emailConfirmed", "phoneNumberConfirmed", "userStatus", "userPanName",
        "userPanNumber", "created_Date", "lastModifiedDate", "userModifiedBy",
        "last_LoginDate", "activation_Date", "sex", "dob",
        "nationality", "deviceToken", "deviceID", "user_planType",
        "sales_In_Charge", "personalPanCardUpload"
      ];
  
      // Check for missing fields in the request body
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({ success: false, msg: "All fields are required", data: missingFields });
      }
  
      // Destructure the request body
      const {
        companyName, parent, type, companyStatus, modifiedBy, logo_URL,
        office_Type, isAutoInvoicing, invoicingPackageName, planType,
        creditPlanType, booking_Prefix, invoicing_Prefix, invoicingTemplate,
        cin_number, signature, pan_Number, HSN_SAC_Code, hierarchy_Level,
        pan_upload, userType, login_Id, email, title, fname,
        lastName, password, securityStamp, phoneNumber,
        twoFactorEnabled, lockoutEnabled,
        emailConfirmed, phoneNumberConfirmed, userStatus, userPanName,
        userPanNumber, created_Date, lastModifiedDate, userModifiedBy,
        last_LoginDate, activation_Date, sex, dob,
        nationality, deviceToken, deviceID, user_planType,
        sales_In_Charge, personalPanCardUpload
      } = req.body;
  
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, msg: "User with this email already exists", data: null });
      }
  
      // Check if a company with the same companyName already exists
      const existingCompany = await Company.findOne({ companyName });
      if (existingCompany) {
        return res.status(400).json({ success: false, msg: "Company with this companyName already exists", data: null });
      }
  
      // Create a new Company document
      const newCompany = new Company({
        companyName, parent, type, companyStatus, modifiedBy, logo_URL,
        office_Type, isAutoInvoicing, invoicingPackageName, planType,
        creditPlanType, booking_Prefix, invoicing_Prefix, invoicingTemplate,
        cin_number, signature, pan_Number, HSN_SAC_Code, hierarchy_Level,
        pan_upload
      });
  
      // Save the Company document to the database
      const savedCompany = await newCompany.save();
  
      // Create a new User document and associate it with the Company document
      const newUser = new User({
        userType, login_Id, email, title, fname, lastName,
        password, securityStamp, phoneNumber, twoFactorEnabled,
        lockoutEnabled, emailConfirmed, phoneNumberConfirmed, userStatus,
        userPanName, userPanNumber, created_Date, lastModifiedDate, userModifiedBy,
        last_LoginDate, activation_Date, sex, dob, nationality, deviceToken, deviceID, user_planType, sales_In_Charge, personalPanCardUpload,
        company_ID: savedCompany._id, // Set the company_ID field to the _id of the saved Company document
      });
  
      // Save the User document to the database
      await newUser.save();
  
      return res.status(200).json({ success: true, msg: 'User and Company Inserted successfully', data: newUser });
    } catch (error) {
      return res.status(500).json({ success: false, msg: error.message, data: null });
    }
  };
  


module.exports = {
    registerUser,
    loginUser,
    userInsert
}
