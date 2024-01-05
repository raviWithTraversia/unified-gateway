const Permission = require('../models/Permission'); 

const permission = [
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Manage Uploads",
      permissionDescription : "Upload the images and banners"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Manage Airline Commission",
      permissionDescription : "Setup the airlines commissions"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Manage Mirror Setup",
      permissionDescription : "User can manage Mirror ID setup"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Manage Fare Rules",
      permissionDescription : "User can view/edit/add custom fare rules"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Generic Cart",
      permissionDescription : "Use can create generic cart"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Email Config",
      permissionDescription : "User can view/edit/add email configurations"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Credit note issue",
      permissionDescription : "User can generate credit note"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Manage card details",
      permissionDescription : "User can manage FOP card details"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Manage bank details",
      permissionDescription : "User can manage bank details"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Emulate User",
      permissionDescription : "Access another user/agency dashboard"
    },
    {
      productName : "Config",
      categoryName : "Main agent management",
      permissionName : "Series booking",
      permissionDescription : "User can edit/load series data"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Approve an agent (Registration)",
      permissionDescription : "Change registration status to approved"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Register an agent (Registration)",
      permissionDescription : "Change registration status to registered"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Manage PLB",
      permissionDescription : "User can view/edit/add PLB"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Manage Commercials",
      permissionDescription : "Can view/create/edit commercials plans"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Manage Incentive",
      permissionDescription : "User can view/edit/add incentives"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Non-air products markup",
      permissionDescription : "Use can create/edit markups for non-air products"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Create Product Plan",
      permissionDescription : "Create a Product Plan that allow products"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Manage Product Plan",
      permissionDescription : "Allow users to modify the plan"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Manage Privilege Plan",
      permissionDescription : "Allow users to modify the privilege plan"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Create Privilege Plan",
      permissionDescription : "Create a privilege plan"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Create Credit Plan",
      permissionDescription : "Create Credit Plan"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Update Credit Plan",
      permissionDescription : "Update Credit Plan"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Update Config",
      permissionDescription : "User can change agent's configuration"
    },
    {
      productName : "Config",
      categoryName : "Agent registration and setup",
      permissionName : "Agency Management",
      permissionDescription : "Agency Management"
    },
    {
      productName : "Config",
      categoryName : "Agent management",
      permissionName : "DI Setup",
      permissionDescription : "DI Setup"
    },
    {
      productName : "Config",
      categoryName : "Agent management",
      permissionName : "Update Payment",
      permissionDescription : "Approve/decline agent's topup request"
    },
    {
      productName : "Config",
      categoryName : "Agent management",
      permissionName : "Action - Credit request",
      permissionDescription : "Can approve/decline credit request"
    },
    {
      productName : "Config",
      categoryName : "Agent management",
      permissionName : "Action - Deposit request",
      permissionDescription : "Can approve/decline deposit request"
    },
    {
      productName : "Config",
      categoryName : "Queues",
      permissionName : "New Registrations Queue",
      permissionDescription : "New Registrations Queue"
    },
    {
      productName : "Config",
      categoryName : "Queues",
      permissionName : "Registred agent config Queue",
      permissionDescription : "Registred agent config Queue"
    },
    {
      productName : "Config",
      categoryName : "Queues",
      permissionName : "Temp Credit RQ Queue",
      permissionDescription : "View temp credit request queue (view only - not action)"
    },
    {
      productName : "Config",
      categoryName : "Queues",
      permissionName : "Deposit RQ Queue",
      permissionDescription : "View deposit request queue (view only - not action)"
    },
    {
      productName : "Config",
      categoryName : "Queues",
      permissionName : "Amendment Queue",
      permissionDescription : "Amendment Queue"
    },
    {
      productName : "Config",
      categoryName : "Reports",
      permissionName : "Credit txn report",
      permissionDescription : ""
    },
    {
      productName : "Config",
      categoryName : "Reports",
      permissionName : "Deposit nett txn report",
      permissionDescription : ""
    },
    {
      productName : "Config",
      categoryName : "Reports",
      permissionName : "Credit nett txn report",
      permissionDescription : ""
    },
    {
      productName : "Config",
      categoryName : "Reports",
      permissionName : "Manage ledger",
      permissionDescription : ""
    },
];

const seedPermissions = async () => {
  try {
    // Check if any companies already exist
    const existing = await Permission.find();
    
    if (existing.length === 0) {     
      await Permission.create(permission); 
      console.log('Permission table seeded successfully.');     
      
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
