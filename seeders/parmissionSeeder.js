const Permission = require('../models/Permission'); 

const permission = [
    {
        name: "",

    },
    {
        name: "role-create",           
    },
    {
        name: "role-edit",          
    }
    , 
    {
        name: "role-delete",           
    }
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
