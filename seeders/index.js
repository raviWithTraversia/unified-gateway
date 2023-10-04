
const { seedCompanies } = require('../seeders/seeder');
const { seedPermissions } = require('../seeders/parmissionSeeder');

async function runSeeders() {
  try {
    await seedCompanies();
    await seedPermissions();   
    console.log('All seeders completed.');
  } catch (err) {
    console.error('Error running seeders:', err);
  }
}

module.exports = runSeeders;
