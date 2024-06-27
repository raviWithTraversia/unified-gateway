
const { seedCompanies } = require('../seeders/companiesSeeder');
const { seedPermissions } = require('../seeders/parmissionSeeder');
const { seedProduct } = require('../seeders/productSeeder');
const { seedProductPlan } = require('../seeders/productPlanSeeder');
const { productPlanHasProductSeeder } = require('../seeders/productPlanHasProductSeeder');
// const { seedCompaniesSmtp } = require('../seeders/companiesSmtp.seeder');
const { seedEmailConfigDescription } = require('../seeders/emailConfigrationDescription.seeder');
const { seedStatus } = require('../seeders/statusSeeder');
const { seedCountry } = require('../seeders/countrySeeder');
const { seedState } = require('../seeders/stateSeeder');
const { seedCity } = require('../seeders/citySeeder');
const { seedCabinClassMaster } = require('../seeders/cabinClassMasterSeeder');
const { seedFareFamilyMaster } = require('../seeders/familyFareMasterSeeder');
const { seedCarrierSeeder } = require('../seeders/carrierSeeder');
const { seedAirCommercialRowMaster } = require('../seeders/airCommertialRowMasterSeeder');
const { seedCommercialColumnMaster } = require('../seeders/airCommertialColumnMasterSeeder');
const { AirCommercialFilterSeeder } = require('../seeders/airCommercialFilterSeeder');
const { seedMarkUpCategoryData } = require('../seeders/markUpCategorySeeder');
const { seedPassportDetailMandatoryForAirline } = require('../seeders/makePassportDetailForAirlineSeeder');
const { WebsiteManagerSeeder } = require("../seeders/websiteManagerSeeder");

async function runSeeders() {
  try {
    // await seedCompanies();
    // await seedPermissions();
    // await seedProduct();
    // await seedProductPlan();
    // await productPlanHasProductSeeder();
    // // await seedCompaniesSmtp();
    // // await seedEmailConfigDescription();
    // await seedCountry(); //seeder working!!!
    // await seedState(); //seeder working!!!
    // await seedCity(); //seeder working!!!
    // // await seedCabinClassMaster();
    // await seedStatus();
    // await seedFareFamilyMaster();
    // await seedCarrierSeeder();
    // // // await seedAirCommercialRowMaster();
    // // await seedCommercialColumnMaster();
    // // await AirCommercialFilterSeeder();
    // await seedMarkUpCategoryData();
    // // await seedPassportDetailMandatoryForAirline();
    // await WebsiteManagerSeeder();
    console.log('All seeders completed.');
  } catch (err) {
    console.error('Error running seeders:', err);
  }
}

module.exports = runSeeders;
