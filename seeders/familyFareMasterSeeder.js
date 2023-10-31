const FareFamilyMaster = require('../models/FareFamilyMaster'); 

const fareData = [
    {
        fareFamilyCode: 'Agency Fare',
        fareFamilyName: 'Agency Fare'
    },
    {
        fareFamilyCode: 'Corp Connect',
        fareFamilyName: 'Corp Connect'
    },
    {
        fareFamilyCode: 'Corp Connect Fare',
        fareFamilyName: 'Corp Connect Fare'
    },
    {
        fareFamilyCode: 'Corporate',
        fareFamilyName: 'Corporate'
    },
    {
        fareFamilyCode: 'Corporate Fare',
        fareFamilyName: 'Corporate Fare'
    },
    {
        fareFamilyCode: 'Corporate Full Flex',
        fareFamilyName: 'Corporate Full Flex'
    },
    {
        fareFamilyCode: 'Corporate Lite',
        fareFamilyName: 'Corporate Lite'
    },
    {
        fareFamilyCode: 'CORPORATE_FLEX',
        fareFamilyName: 'CORPORATE_FLEX'
    },
    {
        fareFamilyCode: 'Coupon',
        fareFamilyName: 'Coupon'
    },
    {
        fareFamilyCode: 'Coupon Fare',
        fareFamilyName: 'Coupon Fare'
    },
    {
        fareFamilyCode: 'EXPRESS_VALUE',
        fareFamilyName: 'EXPRESS_VALUE'
    },
    {
        fareFamilyCode: 'Family Fare',
        fareFamilyName: 'Family Fare'
    },
    {
        fareFamilyCode: 'Flexi Fare',
        fareFamilyName: 'Flexi Fare'
    },
    {
        fareFamilyCode: 'Flexi Plus Fare',
        fareFamilyName: 'Flexi Plus Fare'
    },
    {
        fareFamilyCode: 'FLEXI_PLUS',
        fareFamilyName: 'FLEXI_PLUS'
    },
    {
        fareFamilyCode: 'Flexible Fare',
        fareFamilyName: 'Flexible Fare'
    },
    {
        fareFamilyCode: 'Flexible Plus Fare',
        fareFamilyName: 'Flexible Plus Fare'
    },
    {
        fareFamilyCode: 'GoFlexi',
        fareFamilyName: 'GoFlexi'
    },
    {
        fareFamilyCode: 'GoMore',
        fareFamilyName: 'GoMore'
    },
    {
        fareFamilyCode: 'InstantPur',
        fareFamilyName: 'InstantPur'
    },
    {
        fareFamilyCode: 'LITE',
        fareFamilyName: 'LITE'
    },
    {
        fareFamilyCode: 'Lite Fare',
        fareFamilyName: 'Lite Fare'
    },
    {
        fareFamilyCode: 'OFFER_FARE_WITHOUT_PNR',
        fareFamilyName: 'OFFER_FARE_WITHOUT_PNR'
    },
    {
        fareFamilyCode: 'Private Fare',
        fareFamilyName: 'Private Fare'
    },
    {
        fareFamilyCode: 'Promo',
        fareFamilyName: 'Promo'
    },
    {
        fareFamilyCode: 'Promo Fare',
        fareFamilyName: 'Promo Fare'
    },
    {
        fareFamilyCode: 'Publish',
        fareFamilyName: 'Publish'
    },
    {
        fareFamilyCode: 'PUBLISHED',
        fareFamilyName: 'PUBLISHED'
    },
    {
        fareFamilyCode: 'REGULAR',
        fareFamilyName: 'REGULAR'
    },
    {
        fareFamilyCode: 'Regular Fare',
        fareFamilyName: 'Regular Fare'
    }, 
    {
        fareFamilyCode: 'Return Fare',
        fareFamilyName: 'Return Fare'
    },
    {
        fareFamilyCode: 'RoundTrip Special Fare',
        fareFamilyName: 'RoundTrip Special Fare'
    },
    {
        fareFamilyCode: 'Sale Fare',
        fareFamilyName: 'Sale Fare'
    },
    {
        fareFamilyCode: 'SM',
        fareFamilyName: 'SM'
    },
    {
        fareFamilyCode: 'SME Fare',
        fareFamilyName: 'SME Fare'
    },
    {
        fareFamilyCode: 'SME.CrpCon',
        fareFamilyName: 'SME.CrpCon'
    }, 
    {
        fareFamilyCode: 'Specal Return Fare',
        fareFamilyName: 'Specal Return Fare'
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
      console.log('Family Fare Master  table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};


module.exports = {
    seedFareFamilyMaster
};

