const Product = require('../models/Product');

const product = [{
  productName: "Flight",
}, {
  productName: "Hotel",
}, {
  productName: "Rail",
}, {
  productName: "Application Config"
}];

const seedProduct = async () => {
  try {
    // Check if any product already exist
    const existing = await Product.find();
    if (existing.length === 0) {
      await Product.create(product);
      console.log('Product seeded successfully.');
    } else {
      // console.log('product table already exists. Skipping seeding.');
    }
  } catch (err) {
    console.error('Error seeding companies table:', err);
  }
};

module.exports = {
  seedProduct
};
