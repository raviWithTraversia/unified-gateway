const status = require("../models/Status");

const statusData = [{
  name: "Pending",
  type: "registration"
}, {
  name: "In-progress",
  type: "registration"
}, {
  name: "Approved",
  type: "registration"
}, {
  "name": "Pending",
  "type": "GST varification"
}, {
  name: "Decline",
  type: "registration"
}];

const seedStatus = async () => {
  try {
    // Check if any companies already exist
    const existingStatus = await status.find();
    if (existingStatus.length === 0) {
      await status.create(statusData);
      console.log('Status table seeded successfully.');
    } else {
      //console.log('Status table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};

module.exports = {
  seedStatus
};
