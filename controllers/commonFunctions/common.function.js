const bcryptjs = require("bcryptjs");
const { Config } = require("../../configs/config");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
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


// Function to send a password reset email
const sendPasswordResetEmail = async (recipientEmail, resetToken) => {
    // Create a Nodemailer transporter using your email service provider's SMTP settings
    const transporter = nodemailer.createTransport({
      host: Config.HOST , // SMTP server hostname or IP address
      port: 587, // Port number for SMTP with STARTTLS
      secure: false, // Set to false when using STARTTLS
      auth: {
        user: Config.USER,
        pass: Config.PASS, // Verify the password for leading/trailing spaces
      },
    });
 
    // Email content
    const mailOptions = {
      from: Config.USER,
      to: recipientEmail,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password:
             http://your-app-url/reset-password?token=${resetToken}`,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };


  const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
  };
  const getPagingData = (Data, page, limit) => {
    const { count: totalItems, rows: data } = Data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, data, totalPages, currentPage };
  };
  const getPagingDataOfSp = async (Data, page, limit) => {
    let total = Data.length ? Data[0].Total : 0;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(total / limit);
    return { totalItems: total, data: Data, totalPages, currentPage };
  };

  const checkIsValidId = async(Id) => {
    let validId = mongoose.isValidObjectId(Id);
    if(validId){
      return "Valid Mongo Object Id"
    }else{
      return "Invalid Mongo Object Id"
    }
  }
 



module.exports = {
    createToken,
    securePassword,
    sendPasswordResetEmail,
    getPagination,
    getPagingData,
    getPagingDataOfSp,
    checkIsValidId
}