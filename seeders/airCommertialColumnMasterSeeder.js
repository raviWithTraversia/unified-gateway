const AirCommercialColumnMaster = require('./../models/AirCommertialColumnMaster');

const columnData = [
    {
        "name" : "Service Fee rate(+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 1,
        "status":true

    },
    {
        "name" : "Discount (-)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 2,
        "status":true
    },
    {
        "name" : "Booking Fee rate(+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 3,
        "status":true
    },
    {
        "name" : "Markup rate(+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 4,
        "status":true
    },
    {
        "name" : "GDS OC Charges (+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 5,
        "status":true
    },
    {
        "name" : "Segment Kickback (-)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 6,
        "status":true
    },
    {
        "name" : "Segment Kickback Import (-)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 7,
        "status":true
    },
    {
        "name" : "Fixed Booking Fee",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 8,
        "status":true
    },
    {
        "name" : "Cancellation Fee",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 9,
        "status":true
    },
    {
        "name" : "Reschedule Fee",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 10,
        "status":true
    },
    {
        "name" : "Fixed Markup (+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 11,
        "status":true
    },
    {
        "name" : "Amendmend Fee Markup(+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 12,
        "status":true
    },
    {
        "name" : "OC Charge(+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 13,
        "status":true
    },
    {
        "name" : "Fixed Service Fee(+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820",
        "priority": 13,
        "status":true
    },
    {
        "name" : "rate %",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 14,
        "status":true
    },
    {
        "name" : "On Fuel Surcharge",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 16,
        "status":true
    },
    {
        "name" : "On Airline Surcharge",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 17,
        "status":true
    },
    {
        "name" : "On Other Tax",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 18,
        "status":true
    },
    {
        "name" : "On YR",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 19,
        "status":true
    },
    {
        "name" : "On Net Basic",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 20,
        "status":true
    },
  
    {
        "name" : "Deduct TDS",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 21,
        "status":true
    },
    {
        "name" : "On Gross",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 22,
        "status":true
    },
    {
        "name" : "Discount on Supplier Discount",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 23,
        "status":true
    },
    {
        "name" : "Exclude Child",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 44,
        "status":true
    },
    {
        "name" : "Exclude Infant",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 24,
        "status":true
    },
    {
        "name" : "GST",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 25,
        "status":true
    },
    {
        "name" : "Base Fare",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 15,
        "status":true
    },
    {
        "name" : "Refund On Cancellation?",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 37,
        "status":true
    },

    {
        "name" : "Adult",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 27,
        "status":true
    },
    {
        "name" : "Child",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 28,
        "status":true
    },
    {
        "name" : "Infant",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 29,
        "status":true
    },
    {
        "name" : "Onward Only",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 30,
        "status":true
    },
    {
        "name" : "Non Zero Only",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 31,
        "status":true
    },
    {
        "name" : "Per Airline Per Pax",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 32,
        "status":true
    },
    {
        "name" : "Per Pnr Per Ticket",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 33,
        "status":true
    },
    {
        "name" : "Deduct TDS",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 34,
        "status":true
    },
    {
        "name" : "Per Flight Per Pax",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 36,
        "status":true
    },
    {
        "name" : "Per Pax Per Sector",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 35,
        "status":true
    },
    {
        "name" : "Refund On Cancellation?",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 26,
        "status":true
    },
    {
        "name" : "Base / Other Taxes",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 38,
        "status":true
    },
    {
        "name" : "Per PNR Per Pax",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 39,
        "status":true
    },
    {
        "name" : "GST",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : "",
        "priority": 25,
        "status":true
    },
];

const seedCommercialColumnMaster = async(req, res) => {

    try {
        const existing = await AirCommercialColumnMaster.find();
        
        if (existing.length === 0) {     
          await AirCommercialColumnMaster.create(columnData); 
          console.log('Air Commercial Column Master table seeded successfully.');     
          
        } else {
          //console.log('Air Commercial coloumn Column table already exists. Skipping seeding.');
        }
      } catch (err) {
        console.error('Error seeding Air Commercial coloumn Column table:', err);
      }
}

module.exports = {
    seedCommercialColumnMaster
}
