const makePassortDetailMandatoryForAirline = require('../models/PassPortDetailForAirline'); 

const Data = [
    samplePassportDetail = {
        airlineCode: "XYZ123",
        passportNumber: true,
        passportExpiry: true,
        dateOfBirth: true,
        dateOfIssue: false, 
        updatedBy: '6555f84d991eaa63cb171aa9' 
    },  
   
];

const seedPassportDetailMandatoryForAirline = async () => {
  try {
    // Check if any product already exist
    const existing = await makePassortDetailMandatoryForAirline.find();
    
    if (existing.length === 0) {     
      await makePassortDetailMandatoryForAirline.create(Data); 
      console.log('Passport Detail For Airline  table seeded successfully.');     
      
    } else {
     // console.log('Family Fare Master  table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};


module.exports = {
    seedPassportDetailMandatoryForAirline
};

