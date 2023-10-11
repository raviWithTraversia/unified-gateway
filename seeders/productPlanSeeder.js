const ProductPlan = require('../models/ProductPlan');
const Company = require('../models/Company');


const seedProductPlan = async () => {

    try {
        const existingCompanies = await Company.find();

        if (existingCompanies.length > 0) {
            const companyID = existingCompanies[0]._id;

            // Check product Plan Exist or Not
            const existProductPlan = await ProductPlan.find();

            if (existProductPlan.length === 0) {

                const addProductPlan = [
                    {
                        productPlanName: "Flight-Plan",
                        companyId: companyID,
                    },
                    {
                        productPlanName: "Hotel-Plan",
                        companyId: companyID,
                    },
                    {
                        productPlanName: "Rail-Plan",
                        companyId: companyID,
                    },

                ];
                // Create product Plan 
                await ProductPlan.create(addProductPlan);

                // console.log('Product Plan table seeded successfully.');
            }
            else {
                // console.log('product plan table already exists. Skipping seeding.');
            }

        } else {
            // console.log('Company table not exists. Skipping seeding.');
        }

    } catch (err) {
        // console.error('Error seeding companies table:', err);
    }
}

module.exports = { seedProductPlan }