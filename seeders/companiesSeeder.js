const Company = require('../models/Company');

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

const seedRoles = async (companyID) => {
    try {
      // Define role data
      const roles = [
        {
          name: "Tmc",        
          companyId: companyID // Set the user ID to the company ID
        }
       
      ];
  
      // Only create roles if none exist
      const existingRoles = await Role.find();
      if (existingRoles.length === 0) {
        await Role.create(roles);
        console.log('Roles table seeded successfully.');
      } else {
        console.log('Roles table already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Roles table:', err);
    }
  };

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


module.exports = {
  seedCompanies
 
};