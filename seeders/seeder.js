const Company = require('../models/Company');
const User = require("../models/User");
const Role = require("../models/Role"); // Import the Role model
const bcrypt = require('bcryptjs');


const companies = [
  {
    companyName: "Host",
    parent: "1",
    type: "Host",
    companyStatus: "Active",
    modifiedBy: "Host",
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
  }
];


const seedCompanies = async () => {
  try {
    // Check if any companies already exist
    const existingCompanies = await Company.find();
   
    if (existingCompanies.length === 0) {
      // Only create companies if none exist
      const createdCompanies = await Company.create(companies); // Create the company records in the database
      console.log('Companies table seeded successfully.');

      // After creating companies, create users with the stored company_ID
      const companyID = createdCompanies[0]._id;
      await seedUsers(companyID); // Pass the company's _id to the seedUsers function

      // Create role documents for users
      await seedRoles(companyID);
    } else {
      console.log('Companies table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};

const users = [
  {
    roleId: "1",
    login_Id: "SuperAdmin",
    email: "admin@traversia.net",
    title: "Mr.",
    fname: "Super",
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
    userModifiedBy: "Super Admin",
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
    company_ID: "1"
  }
];

const seedUsers = async (companyID) => {
  try {
    const saltRounds = 10;
    for (const user of users) {
      user.companyId = companyID; // Set the company_ID for the user
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);    
      user.password = hashedPassword;
    }
    // Only create users if none exist
    await User.create(users);
    console.log('Users table seeded successfully.');
  } catch (err) {
    console.error('Error seeding User table:', err);
  }
};

const seedRoles = async (companyID) => {
  try {
    // Define role data
    const roles = [
      {
        name: "Tmc",        
        companyId: companyID // Set the user ID to the company ID
      },
      {
        name: "Admin",        
        companyId: companyID // Set the user ID to the company ID
      }
     
    ];

    // Only create roles if none exist
    const existingRoles = await Role.find();
    if (existingRoles.length === 0) {
      await Role.create(roles);
      console.log('Roles table seeded successfully.');
    } else {
     // console.log('Roles table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding Roles table:', err);
  }
};


module.exports = {
  seedCompanies
};