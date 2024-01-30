const smtp = require('../models/Smtp');
const companySmtp = [
    {
      companyId : "1",
      host : "smtp.hostinger.com",
      port : 587,
      security : "SSL" ,
      userName :"developer@traversia.tech",
      password : "Ttpl@2023",
      emailFrom : "developer@traversia.tech",
      status : true
  
    }
  ];
  
  const seedCompaniesSmtp = async () => {
    try {
      // Check if any companies already exist
      const existingCompaniesSmtp = await smtp.find();
      
      if (existingCompaniesSmtp.length === 0) {
        // Only create companies if none exist
        const createdCompaniesSmtp = await smtp.create(companySmtp); // Create the company records in the database
      } else {
      //  console.log('Companies table already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding companies table:', err);
    }
  };

  module.exports = {
    seedCompaniesSmtp
  }