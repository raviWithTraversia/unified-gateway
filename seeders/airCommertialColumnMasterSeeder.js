const AirCommercialColumnMaster = require('./../models/AirCommertialColumnMaster');

const columnData = [
    {
        "name" : "Service Fee rate(+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Discount (-)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Booking Fee rate(+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Markup rate(+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "GDS OC Charges (+)",
        "commercialType" : "rate",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Segment Kickback (-)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Segment Kickback Import (-)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Fixed Booking Fee",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Cancellation Fee",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Reschedule Fee",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Fixed Markup (+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Amendmend Fee Markup(+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "OC Charge(+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "Fixed Service Fee(+)",
        "commercialType" : "fixed",
        "type" : "row",
        "modifiedBy" : "6538c0314756928875840820"
    },
    {
        "name" : "rate %",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Fuel Surcharge",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Airline Surcharge",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Other Tax",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On YR",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Net Basic",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
  
    {
        "name" : "Deduct TDS",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "On Gross",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Discount on Supplier Discount",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Exclude Child",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Exclude Infant",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "GST",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Base Fare",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Refund On Cancellation?",
        "commercialType" : "rate",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },

    {
        "name" : "Adult",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Child",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Infant",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Onward Only",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Non Zero Only",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Per Airline Per Pax",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Per Pnr Per Ticket",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Deduct TDS",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Per Flight Per Pax",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Per Pax Per Sector",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Refund On Cancellation?",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "Base / Other Taxes",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
    },
    {
        "name" : "GST",
        "commercialType" : "fixed",
        "type" : "coloumn",
        "modifiedBy" : "6538c0314756928875840820",
        "modifiedDate" : ""
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
