const markUpCategoryMasterModels = require('../models/MarkupCategoryMaster');
const markUpCategoryData = [
    
    {
        markUpCategoryName : "Basic"
    },
    {
        markUpCategoryName : "Tax"
    },
    {
        markUpCategoryName : "BookingFee"
    }
]
const seedMarkUpCategoryData = async () => {
    try {
        // Check if any country already exist
        const existing = await markUpCategoryMasterModels.find();

        if (existing.length === 0) {
            await markUpCategoryMasterModels.create(markUpCategoryData);
            console.log('markupCategory table table seeded successfully.');

        } else {
           // console.log('markupCategory table already exists. Skipping seeding.');
        }
    } catch (err) {
        console.error('Error seeding markupCategory table:', err);
    }
};


module.exports = {
    seedMarkUpCategoryData
};