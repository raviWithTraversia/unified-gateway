const Permission = require('../models/Permission'); 

const permission = [
    {
      category: "Flight",
      productName : "Config",
      categoryName : "Flight Booking",
      permissionName : "flight",
      permissionDescription : "This could be a reference to a confirmation number or description of the ticket that grants permission to board a flight"
    },
    {
      category: "Hotel",
      productName : "Hotel",
      categoryName : "Hotel Booking",
      permissionName : "hotel",
      permissionDescription : "Information about the hotel's check-in and check-out times and any special procedures that guests need to follow"
    },
    {
      category: "Train",
      productName : "Train",
      categoryName : "Train Booking",
      permissionName : "train",
      permissionDescription : "Information on where and how to board the train, including platform or station details and any specific boarding instructions"
    },
];

const seedPermissions = async () => {
  try {
    // Check if any companies already exist
    const existing = await Permission.find();
    
    if (existing.length === 0) {     
      await Permission.create(permission); 
      console.log('Permission table seeded successfully.');     
      
    } else {
      console.log('Permission table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};


module.exports = {
    seedPermissions
};
