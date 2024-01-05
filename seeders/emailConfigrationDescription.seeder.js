const EmailDiscription = require('../models/EmailConfigDiscription');

const emailConfigDescription = [
    {
     descriptionName : "On booking cancellation",
     status : true
    },
    {
     descriptionName : "Successfully booked travel details",
     status : true
    },
    {
     descriptionName : "CREDIT OVER DUE",
     status : true
    },
    {
     descriptionName : "Forget Password",
     status : true
    },
    {
     descriptionName : "Successfully booked Hotel",
     status : true
    },
    {
     descriptionName : "LoginOTP",
     status : true
    },
    {
     descriptionName : "Partial Cancellation",
     status : true
    }
   ] ;

   const seedEmailConfigDescription = async () => {
    try {
      // Check if any companies already exist
      const EmailConfigDescription = await EmailDiscription.find();
      //console.log(EmailConfigDescription);
      
      if (EmailConfigDescription.length === 0) {
        // Only create companies if none exist
        const createdEmailConfigDescription = await EmailDiscription.create(emailConfigDescription); // Create the company records in the database
        console.log('createdEmailConfigDescription table seeded successfully.============>>>>>>>>>>>>>>');
      } else {
        //console.log('Companies table already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding companies table:', err);
    }
  };
  
  module.exports = {
    seedEmailConfigDescription
  };
  