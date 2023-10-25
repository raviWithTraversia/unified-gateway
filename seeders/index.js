
const { seedCompanies } = require('../seeders/companiesSeeder');
const { seedPermissions } = require('../seeders/parmissionSeeder');
const { seedProduct } = require('../seeders/productSeeder'); 
const { seedProductPlan} = require('../seeders/productPlanSeeder');
const { productPlanHasProductSeeder } = require('../seeders/productPlanHasProductSeeder');
const { seedCompaniesSmtp } = require('../seeders/companiesSmtp.seeder');
const { seedEmailConfigDescription } = require('../seeders/emailConfigrationDescription.seeder');
const { seedStatus } = require('../seeders/statusSeeder');
const { seedRoles } = require('../seeders/roleSeeder')

async function runSeeders() {
  try {
    await seedCompanies();
    await seedPermissions(); 
    await seedProduct(); 
    await seedProductPlan();
    await productPlanHasProductSeeder();

    await seedPermissions();
    await seedCompaniesSmtp();
    await seedEmailConfigDescription();  
   // await seedRoles()

    await seedStatus();
    console.log('All seeders completed.');
  } catch (err) {
    console.error('Error running seeders:', err);
  }
}

module.exports = runSeeders;
