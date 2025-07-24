require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { seedDatabase } = require('./seed.ts');

seedDatabase();
