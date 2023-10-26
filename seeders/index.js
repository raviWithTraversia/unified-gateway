
const { seedCompanies } = require('../seeders/companiesSeeder');
const { seedPermissions } = require('../seeders/parmissionSeeder');
const { seedProduct } = require('../seeders/productSeeder'); 
const { seedProductPlan} = require('../seeders/productPlanSeeder');
const { productPlanHasProductSeeder } = require('../seeders/productPlanHasProductSeeder');
const { seedCompaniesSmtp } = require('../seeders/companiesSmtp.seeder');
const { seedEmailConfigDescription } = require('../seeders/emailConfigrationDescription.seeder');
<<<<<<< Updated upstream
const { seedStatus } = require('../seeders/statusSeeder');
const { seedRoles } = require('../seeders/roleSeeder')
=======
const { seedStatus } = require('../seeders/status.seeder');
const { seedCountry} = require('../seeders/countrySeeder');
const { seedState} = require('../seeders/stateSeeder');
const { seedCity} = require('../seeders/citySeeder');
const { seedCabinClassMaster} = require('../seeders/cabinClassMasterSeeder');
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
   // await seedRoles()

=======
    await seedCountry();
    await seedState();
    await seedCity();
    await seedCabinClassMaster();
>>>>>>> Stashed changes
    await seedStatus();
    console.log('All seeders completed.');
  } catch (err) {
    console.error('Error running seeders:', err);
  }
}

module.exports = runSeeders;
