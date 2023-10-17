
const { seedCompanies } = require('../seeders/seeder');
const { seedPermissions } = require('../seeders/parmissionSeeder');
const { seedProduct } = require('../seeders/productSeeder'); 
const { seedProductPlan} = require('../seeders/productPlanSeeder');
const { productPlanHasProductSeeder } = require('../seeders/productPlanHasProductSeeder');

async function runSeeders() {
  try {
    await seedCompanies();
    await seedPermissions(); 
    await seedProduct(); 
    await seedProductPlan();
    await productPlanHasProductSeeder();

    console.log('All seeders completed.');
  } catch (err) {
    console.error('Error running seeders:', err);
  }
}

module.exports = runSeeders;
