const AirCommercialFilter = require('../models/AirCommercialFilter');

const filter = [
    {
        rowName: "DeptDate",
        type : 'date',
    },
    {
        rowName: "BookingDate",
        type : 'date',
    },
    // {
    //     rowName: "TravelDate",
    //     type : 'date',
    // }, 
    {
        rowName: "AllAirport",
        type : 'text',
    },
    {
        rowName: "MarketingCarrier(Val)",
        type : 'text',
    },
    {
        rowName: "OperatingCarrier",
        type : 'text',
    },
    // {
    //     rowName: "AccountCode",
    //     type : 'text',
    // },
    {
        rowName: "TourCode",
        type : 'text',
    },
    {
        rowName: "FareBasis",
        type : 'text',
    },
    {
        rowName: "RBD",
        type : 'text',
    }, 
    // {
    //     rowName: "SourceId",
    //     type : 'text',
    // },
    {
        rowName: "ProductClass",
        type : 'text',
    },             
    {
        rowName: "FareRange",
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
       // console.log(' Commercial Filter already exists. Skipping seeding.');
      }
    } catch (err) {
      console.error('Error seeding Commercial filter table:', err);
    }
  };
  
  module.exports = {
    AirCommercialFilterSeeder
  };
  