const AirCommercialRowMaster = require('./../models/AirCommertialRowMaster');

const rowMasterData = [
    {
        "name" : "Rate On Base fare",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Fuel Surcharge",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Airline Surcharge",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Other Tax",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On YR",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Net Basic",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Net Basic",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Deduct TDS",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Gross",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Discount on Supplier Discount",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },

    {
        "name" : "Adult",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Child",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Infant",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Onward Only",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Non Zero Only",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Per Airline Per Pax",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Per Pnr Per Ticket",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Deduct TDS",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "via Nocharge",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
];

const seedAirCommercialRowMaster = async(req , res) => {
    // try {
    //     // Check if any seedAirCommercialRowMaster already exist
    //     const existing = await AirCommercialRowMaster.find();
        
    //     if (existing.length === 0) {     
    //       await AirCommercialRowMaster.create(rowMasterData); 
    //       console.log('Air Commercial Row Master table seeded successfully.');     
          
    //     } else {
    //       console.log('Air Commercial Row Master table already exists. Skipping seeding.');
    //     }
    //   } catch (err) {
    //     console.error('Error seeding Air Commercial Row Master table:', err);
    //   }
}

module.exports = {
    seedAirCommercialRowMaster
}