const SupplierCode = require("../models/supplierCode");

const WebsiteManagerSeeder = async () => {
    try {
        // Check if any companies already exist
        const existingStatus = await SupplierCode.find();
        if (existingStatus.length === 0) {
            await SupplierCode.create([{
                "supplierCode": "Kafila"
            }]);
            console.log('SupplierCode seeded successfully.');
        } else {
            //console.log('Status table already exists. Skipping seeding.');
        }
    } catch (err) {
        console.error('Error seeding SupplierCode:', err);
    }
};

module.exports = {
    WebsiteManagerSeeder
}