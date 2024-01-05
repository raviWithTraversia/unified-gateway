const FareFamilyMaster = require('../models/FareFamilyMaster'); 

const fareData = [
    {
        companyId: '6555f84c991eaa63cb171a9f',
        fareFamilyCode: 'ST',
        fareFamilyName: 'ST'
    },  
    {
        companyId: '6555f84c991eaa63cb171a9f',
        fareFamilyCode: 'DF',
        fareFamilyName: 'DF'
    },  
    {
        companyId: '6555f84c991eaa63cb171a9f',
        fareFamilyCode: 'SC',
        fareFamilyName: 'SC'
    },  
    {
        companyId: '6555f84c991eaa63cb171a9f',
        fareFamilyCode: 'DN',
        fareFamilyName: 'DN'
    },  
    {
        companyId: '6555f84c991eaa63cb171a9f',
        fareFamilyCode: 'CORP',
        fareFamilyName: 'CORP'
    },  
];

const seedFareFamilyMaster = async () => {
  try {
    // Check if any product already exist
    const existing = await FareFamilyMaster.find();
    
    if (existing.length === 0) {     
      await FareFamilyMaster.create(fareData); 
      console.log('Family Fare Master  table seeded successfully.');     
      
    } else {
     // console.log('Family Fare Master  table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};


module.exports = {
    seedFareFamilyMaster
};

