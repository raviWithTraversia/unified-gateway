const User = require("../../models/User");
const Company = require("../../models/Company");
const bcryptjs = require("bcryptjs");
const commonFunction = require('../commonFunctions/common.function')
const { Status } = require("../../utils/constants")

const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        console.log(req.body);

        if (!name || !email || !password || !mobile) {
           return {
             response : 'All fields are required'
           }
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return {
                response :  'Invalid email format'
            }
        }

        // Validate password strength (e.g., minimum length of 8 characters)
        if (password.length < 8) {
            return {
                response : 'Password must be at least 8 characters long'
            }
        }

        const spassword = await commonFunction.securePassword(password);
        const newUser = new User({
            name,
            email,
            password: spassword,
            mobile
           
        });

        const userData = await User.findOne({ email });

        if (userData) {
            return {
                response : 'This email is already in use'
            }
        } else {
            const user_data = await newUser.save();
            return  {
                response : 'Registered Successfully'
            }
        }
    } catch (error) {
       console.log(error);
       throw error;
    }
}


const loginUser = async (req, res) => {
    try {
 
      const { email, phoneNumber, password } = req.body;
       
        // Find the user by email
        const user = await User.findOne({
          $or: [
            { email: email },
            { phoneNumber: phoneNumber },
          ],
        });
       

        if (!user) {
            return {
                response : 'User not found'
            }
           
        }
        if(user.userStatus === Status.InActive ){
          return {
            response : 'User is not active'
          }
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid =  bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return {
                response : 'Invalid password'
            }
        }
        const token = await commonFunction.createToken(user._id);
        const userDetails = {
            _id:user._id,
            name:user.name,
            email:user.email,
            phoneNumber:user.phoneNumber,
            token:token            
        }
        // Password is valid; user is authenticated
        return {
            response : 'Login successful',
            data : userDetails
        }
      //  res.status(200).json({ success: true, msg: "Login successful", data: userDetails });
    } catch (error) {
        console.log(error);
        throw error;
    }
}


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
        "userType",
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
        "created_Date",
        "lastModifiedDate",
        "userModifiedBy",
        "last_LoginDate",
        "activation_Date",
        "sex",
        "dob",
        "nationality",
        "deviceToken",
        "deviceID",
        "user_planType",
        "sales_In_Charge",
        "personalPanCardUpload"
      ];
 
      // Check for missing fields in the request body
      const missingFields = requiredFields.filter((fieldName) => req.body[fieldName] === null || req.body[fieldName] === undefined);
      if (missingFields.length > 0) {
        const missingFieldsString = missingFields.join(', ');
        return {
            response : null,
            isSometingMissing : true,
            data : `Missing or null fields: ${missingFieldsString}` 
        }
       
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
        personalPanCardUpload
      } = req.body;
 
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          response : 'User with this email already exists',
          data : null
        }
      }
 
      // Check if a company with the same companyName already exists
      const existingCompany = await Company.findOne({ companyName });
      if (existingCompany) {
        return {
          response : 'Company with this companyName already exists',
          data: null
        }
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
        pan_upload
      });
 
      // Save the Company document to the database
      const savedCompany = await newCompany.save();
      const  securePassword = await commonFunction.securePassword(password);
      // Create a new User document and associate it with the Company document
      const newUser = new User({
        userType,
        login_Id,
        email,
        title,
        fname,
        lastName,
        password : securePassword,
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
        company_ID: savedCompany._id, // Set the company_ID field to the _id of the saved Company document
      });
 
      // Save the User document to the database
      await newUser.save();
      return {
        response : 'User and Company Inserted successfully',
        data: {newUser,newCompany}
      }
     // return res.status(200).json({ success: true, msg: 'User and Company Inserted successfully', data: newUser });
    } catch (error) {
      if(savedCompany){
        await Company.findByIdAndRemove(savedCompany._id);
      }
     console.log(error);
     throw error;
    }
  };

  

  const forgotPassword = async (req, res) => {
    const { email } = req.body;
 
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
          response : "User not found"
        }
      }
     
 
      // Send a password reset email to the user
      await commonFunction.sendPasswordResetEmail(user.email, resetToken);
      return {
        response : "Password reset email sent"
      }
 
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, msg: "Internal server error" });
    }
  };

  const resetPassword = async (req,res) => {
   try{
     const { email, resetToken, newPassword } = req.body;
   
  // Find the user by email and check the reset token
  const user = await User.findOne({ email, resetToken });
  if (!user) {
    return {
      response : 'Invalid reset token'
    }
  //  return res.status(401).json({ message: 'Invalid reset token' });
  }

  // Hash the new password
  const spassword = await commonFunction.securePassword(newPassword);
  console.log(spassword)

  // Update the user's password and reset the resetToken
  await User.findOneAndUpdate(
    { email },
    { $set: { password: spassword, resetToken: null } }
  );
  console.log("password reset sucessfully");

  return {
    response : 'Password reset successful'
  }
}catch(error){
  console.error(error);
  return res.status(500).json({ success: false, msg: "Internal server error" });
}

  }

  /**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Change User Password
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *           example:
 *             email: user@example.com
 *             currentPassword: currentPassword123
 *             newPassword: newPassword456
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               response: Password Change Successfully
 *       '401':
 *         description: Invalid current password
 *         content:
 *           application/json:
 *             example:
 *               response: Your current password is not valid
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               response: User for this mail-id does not exist
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               response: Internal server error
 */

  const changePassword = async (req,res) => {
    try{
      const { currentPassword, newPassword, email } = req.body;
      const user = await User.findOne({email});
      console.log("===========>>>>>>>" ,user, "<<<<<<<============")
      if(user.length){
       const isCurrentPasswordIsValid = await commonFunction.comparePassword(currentPassword, user.password);
        if(isCurrentPasswordIsValid){
          user.password = await commonFunction.securePassword(newPassword);
          await user.save()
          return {
            response : "Password Change Sucessfully",
          }
        }else{
          return {
            response : "Your current password is not valid"
          }
        }
      }else{
        return {
          response : "User for this mail-id not exist"
        }
      }
       
    }catch{
      console.log(error);
      throw error;
    }
  }

module.exports = {
    registerUser,
    loginUser,
    userInsert,
    forgotPassword,
    resetPassword,
    changePassword
}