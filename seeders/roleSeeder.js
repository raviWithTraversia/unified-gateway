const roles = require('../models/Role');

const role = [
    {
        name: "Admin" ,
        companyId: '651bfac44a7853f4df0d81c8'
    },
    {
        name: "TMC" ,
        companyId: '651bfac44a7853f4df0d81c8'
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
        console.log(' Roles already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Roles table:', err);
    }
  };
  
  module.exports = {
    seedRoles
  };
  