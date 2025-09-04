const { getPayload } = require('payload');
const config = require('./src/payload.config.simple');

async function createAdminUser() {
  try {
    const payload = await getPayload({
      config,
    });

    // Check if admin user already exists
    const existingAdmin = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'admin@modernmen.com'
        }
      }
    });

    if (existingAdmin.docs.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@modernmen.com',
        name: 'Modern Men Admin',
        role: 'admin',
        password: 'admin123'
      }
    });

    console.log('Admin user created successfully:', adminUser.email);
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();
