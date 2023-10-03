
const { seedCompanies, seedUsers } = require('../seeders/seeder');

async function runSeeders() {
  try {
    await seedCompanies();
    await seedUsers();   
    console.log('All seeders completed.');
  } catch (err) {
    console.error('Error running seeders:', err);
  }
}

module.exports = runSeeders;
