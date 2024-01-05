const roles = require('../models/Role');

const role = [
    {
        name: "Admin" ,
        companyId: '6538c0314756928875840820'
    },
    {
        name: "TMC" ,
        companyId: '6538c0314756928875840820'
    }
       
   ] ;

   const seedRoles = async () => {
    try {
      // Check if any companies already exist
      const getRole = await roles.find();
      //console.log(EmailConfigDescription);
      
      if (getRole.length === 0) {
        // Only create companies if none exist
        const createdRoles = await roles.create(role); // Create the company records in the database
        console.log('Roles table seeded successfully.============>>>>>>>>>>>>>>');
      } else {
       // console.log(' Roles already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Roles table:', err);
    }
  };
  
  module.exports = {
    seedRoles
  };
  