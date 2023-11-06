const AirCommercialColumnMaster = require('./../models/AirCommertialColumnMaster');

const columnData = [
    {
        "name" : "Discount (-)",
        "commercialType" : "Rate",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Booking Fee Rate(+)",
        "commercialType" : "Rate",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Markup Rate(+)",
        "commercialType" : "Rate",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "GDS OC Charges (+)",
        "commercialType" : "Rate",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Fixed Booking Fee",
        "commercialType" : "fixed",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Cancellation Fee",
        "commercialType" : "fixed",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Reschedule Fee",
        "commercialType" : "fixed",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Fixed Markup (+)",
        "commercialType" : "fixed",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Amendmend Fee Markup(+)",
        "commercialType" : "fixed",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "OC Charge(+)",
        "commercialType" : "fixed",
        "modifiedBy" : "6538c0314756928875840820"
    },
];

const seedCommercialColumnMaster = async(req, res) => {

    try {
        const existing = await AirCommercialColumnMaster.find();
        
        if (existing.length === 0) {     
          await AirCommercialColumnMaster.create(columnData); 
          console.log('Air Commercial Column Master table seeded successfully.');     
          
        } else {
          console.log('Air Commercial Row Column table already exists. Skipping seeding.');
        }
      } catch (err) {
        console.error('Error seeding Air Commercial Row Column table:', err);
      }
}

module.exports = {
    seedCommercialColumnMaster
}
