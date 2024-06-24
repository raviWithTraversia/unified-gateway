const Permission = require('../models/Permission');

const permission = [{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Create-Product-Plan",
  "permissionDescription": "For Creating Product Plan"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Product-Plan",
  "permissionDescription": "For View Product Plan List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Privellage-Plan",
  "permissionDescription": "For View Privellage Plan List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Create-Privellage-Plan",
  "permissionDescription": "For Creating Privellage Plan"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "New-Registrations-List",
  "permissionDescription": "For View All New Registrations"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Agency",
  "permissionDescription": "For View All Agency  and Distributor  Configration"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Roles-Permission",
  "permissionDescription": "For Assign Role Permission"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Bank-Details",
  "permissionDescription": "For View Bank Details List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Fare-Rules",
  "permissionDescription": "For View Fare Rules List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Add-Fare-Rules",
  "permissionDescription": "For Adding Fare Rules"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Deposite-Incentive",
  "permissionDescription": "For View Deposite Incentive List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Credit-Requests",
  "permissionDescription": "For View  Credit Requests List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Uploads",
  "permissionDescription": "For Setting System Uploads "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Payment-Gatway-Charges",
  "permissionDescription": "For View Payment Gatway Charges List "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-PLB-Master",
  "permissionDescription": "For View PLB Master List "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Incentive-Master",
  "permissionDescription": "For View Incentive Master List "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Airline-Promocode",
  "permissionDescription": "For View Airline PromocodeList "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Agency-Group",
  "permissionDescription": "For View Airline Agency-Group List "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Commercial-Plans",
  "permissionDescription": "For View  Commercial Plans List "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Agent-Markup",
  "permissionDescription": "For View  Agent Markup List "
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Country-Mapping-List",
  "permissionDescription": "Country mapping for PLB and Incentive"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Country-Mapping-List_For_PLB_And_Incentive",
  "permissionDescription": "Country mapping for PLB and Incentive"
},
{
  "productName": "Flight",
  "categoryName": "Flight",
  "permissionName": "Flight-Search",
  "permissionDescription": "Enable Flight Search to The User"
},
{
  "productName": "Flight",
  "categoryName": "Flight",
  "permissionName": "Flight-Booking",
  "permissionDescription": "Enable Flight Booking  to The User"
},
{
  "productName": "Flight",
  "categoryName": "Flight",
  "permissionName": "Flight-Hold",
  "permissionDescription": "allow  Hold Ticket to The User"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-SSR-Commercials",
  "permissionDescription": "Manage SSR Commercials is Used for Applay Commercials on Seat,Meal,Baggage"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-Deposit-Incentive",
  "permissionDescription": "Manage Deposit Incentive is Used for DI"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Import PNR",
  "permissionDescription": "Import PNR"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage Email Config",
  "permissionDescription": "Manage Email Config"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage Card Details",
  "permissionDescription": "Manage Card Details"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "My Booking Air",
  "permissionDescription": "My Booking Air"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Generic Cart Flight Booking",
  "permissionDescription": "Generic Cart Flight Booking"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Booking Calender",
  "permissionDescription": "Booking Calender"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage Amendment",
  "permissionDescription": "Manage Amendment"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage Fix Departures",
  "permissionDescription": "Manage Fix Departures"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Group Booking Passenger",
  "permissionDescription": "Group Booking Passenger"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "DSR Reports",
  "permissionDescription": "DSR Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Transation Reports",
  "permissionDescription": "Transation Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Booking Reports",
  "permissionDescription": "Booking Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Cancellation Reports",
  "permissionDescription": "Cancellation Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Flight Search Reports",
  "permissionDescription": "Flight Search Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Ledger",
  "permissionDescription": "Ledger"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Top-Performance-List",
  "permissionDescription": "Top-Performance-List"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Manage-User",
  "permissionDescription": "Manage-User"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Pending-Queues",
  "permissionDescription": "Pending-Queues"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Hold-Queues",
  "permissionDescription": "Hold-Queues"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "All-Failed-Queues",
  "permissionDescription": "All-Failed-Queues"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Refund-Pending-Queues",
  "permissionDescription": "Refund-Pending-Queues"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Registe-Agent-Config-Queues",
  "permissionDescription": "Registe-AgentConfig-Queues"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Amendement-Queues",
  "permissionDescription": "Amendement-Queues"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Deposit Requests",
  "permissionDescription": "Deposit Requests"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Billing-Reports",
  "permissionDescription": "Billing-Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Download-Api-Log",
  "permissionDescription": "Download-Api-Log"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Download-Portal-Log",
  "permissionDescription": "Download-Portal-Log"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Sales Reports",
  "permissionDescription": "Sales Reports"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Pending Cancel Booking",
  "permissionDescription": "Pending Cancel Booking"
},
{
  "productName": "Application Config",
  "categoryName": "Application Config",
  "permissionName": "Amendment Cart",
  "permissionDescription": "Amendment Cart"
},
{
  "productName": "Rail",
  "categoryName": "Rail",
  "permissionName": "Rail-Search",
  "permissionDescription": "Rail Serach"
}];

const seedPermissions = async () => {
  try {
    // Check if any companies already exist
    const existing = await Permission.find();
    if (existing.length === 0) {
      await Permission.create(permission);
      console.log('Permissions seeded successfully.');
    } else {
      // console.log('Permission table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};

module.exports = {
  seedPermissions
};
