const ProductPlanHasProduct = require('../models/ProductPlanHasProduct');
const ProductPlan = require('../models/ProductPlan');
const Product = require('../models/Product');

const productPlanHasProductSeeder = async () => {

    try {
        // check productPlanHasProduct find or fail
        const exitsProductPlanHasProduct = await ProductPlanHasProduct.find();

        if (exitsProductPlanHasProduct.length === 0) {

            // check product exist
            const existProduct = await Product.find();
            const existProductPlan = await ProductPlan.find();
            if(existProduct.length > 0) {
                const addProductPlanHasProduct = [{
                    productPlaneId: existProductPlan[0]._id,
                    productId: existProduct[0]._id
                }];
            }
            await ProductPlanHasProduct.create(addProductPlanHasProduct); 
            // console.log('ProductPlanHasProduct table seeded successfully.');     
        }
        else {
            // console.log('productPlanHasProduct table already exists. Skipping seeding.');
        }

    } catch (error) {
        // console.error('Error seeding productPlanHasProduct table:', err);
    }

}

module.exports = { productPlanHasProductSeeder }