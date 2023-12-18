const AirCommercialFilter = require('../models/AirCommercialFilter');

const filter = [
    {
        rowName: "AllAirport" ,
    },
    {
        rowName: "bookingDate" ,
    },
    {
        rowName: "onTravelDate" ,
    },
    {
        rowName: "returnDeptDate" ,
    },
    {
        rowName: "RBD" ,
    },
    {
        rowName: "operatingCarrier" ,
    },
    {
        rowName: "marketingCarrier" ,
    },
    {
        rowName: "accountCode" ,
    },
    {
        rowName: "fareBase" ,
    },
    {
        rowName: "tourCode" ,
    },
    {
        rowName: "fareRange" ,
    },
    {
        rowName: "sourceId" ,
    },
    {
        rowName: "productClass" ,
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
  