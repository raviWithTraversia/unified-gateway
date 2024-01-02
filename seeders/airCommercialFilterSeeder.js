const AirCommercialFilter = require('../models/AirCommercialFilter');

const filter = [
    {
        rowName: "AllAirport" ,
        type : 'text',
    },
    {
        rowName: "bookingDate" ,
        type : 'date',
    },
    {
        rowName: "onTravelDate" ,
        type : 'date',
    },
    {
        rowName: "returnDeptDate" ,
        type : 'date',
    },
    {
        rowName: "RBD" ,
        type : 'text',
    },
    {
        rowName: "operatingCarrier" ,
        type : 'text',
    },
    {
        rowName: "marketingCarrier" ,
        type : 'text',
    },
    {
        rowName: "accountCode" ,
        type : 'text',
    },
    {
        rowName: "fareBase" ,
        type : 'text',
    },
    {
        rowName: "tourCode" ,
        type : 'text',
    },
    {
        rowName: "fareRange" ,
        type : 'text',
    },
    {
        rowName: "sourceId" ,
        type : 'text',
    },
    {
        rowName: "productClass" ,
        type : 'text',
    }
   ] ;

   const AirCommercialFilterSeeder = async () => {
    try {
      // Check if any companies already exist
      const AirCommercialFilterList = await AirCommercialFilter.find();

      if (AirCommercialFilterList.length === 0) {
        // Only create filter if none exist
        const createdRoles = await AirCommercialFilter.create(filter); 
      } else {
        console.log(' Commercial Filter already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Commercial filter table:', err);
    }
  };
  
  module.exports = {
    AirCommercialFilterSeeder
  };
  