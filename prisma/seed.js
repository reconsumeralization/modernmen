require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { exec } = require('child_process');

exec('tsx prisma/seed.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  console.log(stdout);
  if (stderr) console.error(stderr);
});