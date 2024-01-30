const status = require("../models/Status") ;

const statusData = [
    {
        name : "Pending", 
        type :  "registration", 
        timestamp : "2023-10-10T12:00:00Z"
    },
    {
        name : "In-progress", 
        type :  "registration", 
        timestamp : "2023-10-10T12:00:00Z"
    },
    {
        name : "Approved", 
        type :  "registration", 
        timestamp : "2023-10-10T12:00:00Z"
    },
    {
        name : "Registration", 
        type :  "registration", 
        timestamp : "2023-10-10T12:00:00Z"
    },
    {
        name : "Decline", 
        type :  "registration", 
        timestamp : "2023-10-10T12:00:00Z"
    }
    
    
 ];

const seedStatus = async () => {
  try {
    // Check if any companies already exist
    const existingStatus = await status.find();
    
    if (existingStatus.length === 0) {     
      await status.create(statusData); 
      console.log('Status table seeded successfully.');     
      
    } else {
      //console.log('Status table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};


module.exports = {
    seedStatus
};
