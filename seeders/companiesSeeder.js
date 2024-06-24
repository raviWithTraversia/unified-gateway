const Company = require('../models/Company');
const User = require("../models/User");
const Role = require("../models/Role"); // Import the Role model
const smtp = require('../models/Smtp');
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

const seedCompanies = async () => {
  try {
    // Check if any companies already exist
    const existingCompanies = await Company.find();
    if (existingCompanies.length === 0) {
      let hostCompanyId = new ObjectId();
      let roleId = new ObjectId();

      const hostCompany = {
        _id: hostCompanyId,
        companyName: "Host",
        parent: hostCompanyId,
        type: "Host",
        companyStatus: "Active",
        modifiedBy: hostCompanyId,
        logo_URL: "logo_url_a.jpg",
        office_Type: "Host",
        cashBalance: 0,
        creditBalance: 0,
        incentiveBalance: 0,
        fixedCreditBalance: 0,
        maxCreditLimit: 0,
        isAutoInvoicing: true,
        invoicingPackageName: "Package A",
        planType: "Plan Type A",
        creditPlanType: "Credit Plan A",
        booking_Prefix: "Prefix A",
        invoicing_Prefix: "Invoice Prefix A",
        invoicingTemplate: "Template A",
        cin_number: "CIN123456",
        signature: "signature_url_a.jpg",
        pan_Number: "PAN12345",
        HSN_SAC_Code: "HSN123",
        hierarchy_Level: "Level A",
        pan_upload: "pan_upload_url_a.jpg",
      };

      const tmcCompany = {
        _id: new ObjectId(),
        companyName: "Kafila",
        parent: hostCompanyId,
        type: "TMC",
        companyStatus: "Active",
        modifiedBy: hostCompanyId,
        logo_URL: "logo_url_a.jpg",
        office_Type: "TMC",
        cashBalance: 0,
        creditBalance: 0,
        incentiveBalance: 0,
        fixedCreditBalance: 0,
        maxCreditLimit: 0,
        isAutoInvoicing: true,
        invoicingPackageName: "Package A",
        planType: "Plan Type A",
        creditPlanType: "Credit Plan A",
        booking_Prefix: "Prefix A",
        invoicing_Prefix: "Invoice Prefix A",
        invoicingTemplate: "Template A",
        cin_number: "CIN123456",
        signature: "signature_url_a.jpg",
        pan_Number: "PAN12345",
        HSN_SAC_Code: "HSN123",
        hierarchy_Level: "Level A",
        pan_upload: "pan_upload_url_a.jpg",
      };

      const role = [{
        _id: roleId,
        name: "TMC",
        companyId: tmcCompany._id, // Set the user ID to the company ID
        type: "Default"
      }, {
        _id: new ObjectId(),
        name: "Agency",
        companyId: tmcCompany._id, // Set the user ID to the company ID
        type: "Default"
      }, {
        _id: new ObjectId(),
        name: "Supplier",
        companyId: tmcCompany._id, // Set the user ID to the company ID
        type: "Default"
      }, {
        _id: new ObjectId(),
        name: "Distributer",
        companyId: tmcCompany._id, // Set the user ID to the company ID
        type: "Default"
      }];

      const user = {
        roleId,
        login_Id: "SuperAdmin",
        email: "admin@traversia.net",
        title: "Mr.",
        fname: tmcCompany.companyName,
        lastName: "Admin",
        password: "Ttpl@2023",
        securityStamp: "security123",
        phoneNumber: "1234567890",
        twoFactorEnabled: true,
        lockoutEnabled: true,
        accessfailedCount: 0,
        emailConfirmed: true,
        phoneNumberConfirmed: true,
        userStatus: "Active",
        userPanName: "Super Admin",
        userPanNumber: "ABCDE1234F",
        created_Date: new Date(),
        lastModifiedDate: new Date(),
        userModifiedBy: tmcCompany._id,
        last_LoginDate: new Date(),
        activation_Date: new Date(),
        deactivation_Date: null, // Null because it's currently active
        sex: "Male",
        dob: new Date("1995-01-15"),
        nationality: "IN",
        deviceToken: "sdfgd4564634536456756cvbnfg",
        deviceID: "sdfsdfs45334dgvd",
        user_planType: 1,
        sales_In_Charge: true,
        personalPanCardUpload: "pancard.jpg",
        isNewUser: false,
        userType: "SuperAdmin",
        company_ID: tmcCompany._id
      };

      const companySmtp = {
        companyId: tmcCompany._id,
        host: "smtp.hostinger.com",
        port: 587,
        security: "SSL",
        userName: "developer@traversia.tech",
        password: "Ttpl@2023",
        emailFrom: "developer@traversia.tech",
        status: true
      }

      // Only create companies if none exist
      await Company.create([hostCompany, tmcCompany]); // Create the company records in the database
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await User.create([user]);
      await Role.create(role);
      await smtp.create([companySmtp]);
      console.log('Companies seeded successfully.');
    } else {
      // console.log('Companies already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies: ', err);
  }
};

module.exports = {
  seedCompanies
};
