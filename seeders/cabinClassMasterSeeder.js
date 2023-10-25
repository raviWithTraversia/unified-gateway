const cabinClassMaster = require('./../models/CabinClassMaster');

const cabinClassData = [
    {
        cabinClassCode: '0866',
        cabinClassName: 'economy class',
    },
    {
        cabinClassCode: '0867',
        cabinClassName: 'premium economy',
    },
    {
        cabinClassCode: '0869',
        cabinClassName: 'business',
    },
    {
        cabinClassCode: '0870',
        cabinClassName: 'first class',
    },
];

const seedCabinClassMaster = async () => {
    try {
        // Check if any cabin classes already exist
        const existingCabinClasses = await cabinClassMaster.find();

        if (existingCabinClasses.length === 0) {
            // Only create cabin classes if none exist
            const createdCabinClasses = await cabinClassMaster.create(cabinClassData);
            console.log('Cabin class master table seeded successfully.');
        } else {
            console.log('Cabin class master table already exists. Skipping seeding.');
        }
    } catch (err) {
        console.error('Error seeding cabin class master table:', err);
    }
};

module.exports = {
    seedCabinClassMaster
};