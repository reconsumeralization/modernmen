const bcrypt = require('bcryptjs');
const password = process.argv[2]; // Get password from command line argument
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error generating hash:', err);
        process.exit(1);
    }
    console.log(hash);
});