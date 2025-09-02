#!/usr/bin/env node

/**
 * Whitelabel Brand Setup Script
 * Quickly configure the CMS for different business types
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Predefined brand templates
const brandTemplates = {
  'hair-salon': {
    name: 'Hair Salon / Barber Shop',
    config: {
      BRAND_NAME: 'Your Hair Salon',
      DEFAULT_BUSINESS_NAME: 'Your Hair Salon',
      DEFAULT_BUSINESS_TAGLINE: 'Premium grooming services for discerning clients',
      DEFAULT_META_DESCRIPTION: 'Experience premium grooming services at our salon. Professional haircuts, styling, and treatments.',
      DEFAULT_KEYWORDS: 'hair salon, haircuts, styling, grooming, beauty treatments',
      BRAND_THEME: 'generic',
      DEFAULT_OPEN_TIME: '09:00',
      DEFAULT_CLOSE_TIME: '19:00'
    }
  },
  
  'law-firm': {
    name: 'Law Firm / Legal Practice',
    config: {
      BRAND_NAME: 'Your Law Firm',
      DEFAULT_BUSINESS_NAME: 'Your Law Firm',
      DEFAULT_BUSINESS_TAGLINE: 'Professional legal services you can trust',
      DEFAULT_META_DESCRIPTION: 'Professional legal services with personalized attention to each client. Experienced attorneys ready to help.',
      DEFAULT_KEYWORDS: 'law firm, legal services, attorney, lawyer, consultation, legal advice',
      BRAND_THEME: 'generic',
      DEFAULT_OPEN_TIME: '08:00',
      DEFAULT_CLOSE_TIME: '17:00'
    }
  },
  
  'restaurant': {
    name: 'Restaurant / Food Service',
    config: {
      BRAND_NAME: 'Your Restaurant',
      DEFAULT_BUSINESS_NAME: 'Your Restaurant',
      DEFAULT_BUSINESS_TAGLINE: 'Exceptional dining experience with fresh, quality ingredients',
      DEFAULT_META_DESCRIPTION: 'Experience exceptional cuisine at our restaurant. Fresh ingredients, expert preparation, and outstanding service.',
      DEFAULT_KEYWORDS: 'restaurant, dining, cuisine, food, reservations, catering',
      BRAND_THEME: 'generic',
      DEFAULT_OPEN_TIME: '11:00',
      DEFAULT_CLOSE_TIME: '22:00'
    }
  },
  
  'medical': {
    name: 'Medical Practice / Healthcare',
    config: {
      BRAND_NAME: 'Your Medical Practice',
      DEFAULT_BUSINESS_NAME: 'Your Medical Practice',
      DEFAULT_BUSINESS_TAGLINE: 'Compassionate healthcare for you and your family',
      DEFAULT_META_DESCRIPTION: 'Quality healthcare services with a personal touch. Experienced medical professionals caring for your health.',
      DEFAULT_KEYWORDS: 'medical practice, healthcare, doctor, physician, medical services, health',
      BRAND_THEME: 'generic',
      DEFAULT_OPEN_TIME: '08:00',
      DEFAULT_CLOSE_TIME: '17:00'
    }
  },
  
  'retail': {
    name: 'Retail Store / Shop',
    config: {
      BRAND_NAME: 'Your Store',
      DEFAULT_BUSINESS_NAME: 'Your Store',
      DEFAULT_BUSINESS_TAGLINE: 'Quality products and exceptional customer service',
      DEFAULT_META_DESCRIPTION: 'Discover quality products and exceptional service at our store. Your satisfaction is our priority.',
      DEFAULT_KEYWORDS: 'retail store, shopping, products, customer service, quality goods',
      BRAND_THEME: 'generic',
      DEFAULT_OPEN_TIME: '10:00',
      DEFAULT_CLOSE_TIME: '18:00'
    }
  },
  
  'modernmen': {
    name: 'Modern Men Hair Salon (Original)',
    config: {
      BRAND_NAME: 'Modern Men Hair Salon',
      DEFAULT_BUSINESS_NAME: 'Modern Men Hair Salon',
      DEFAULT_BUSINESS_TAGLINE: 'Premium grooming services for the modern gentleman',
      DEFAULT_META_DESCRIPTION: 'Experience premium grooming services at Modern Men Hair Salon. Professional haircuts, beard grooming, and styling.',
      DEFAULT_KEYWORDS: 'hair salon, barber, grooming, haircuts, beard grooming, men styling',
      BRAND_THEME: 'modernmen',
      DEFAULT_OPEN_TIME: '09:00',
      DEFAULT_CLOSE_TIME: '19:00'
    }
  },
  
  'custom': {
    name: 'Custom Configuration',
    config: {} // Will be filled by user input
  }
};

function showMenu() {
  console.log('\n🎨 Payload CMS Whitelabel Brand Setup\n');
  console.log('Choose a business type to configure:');
  
  Object.entries(brandTemplates).forEach(([key, template], index) => {
    console.log(`${index + 1}. ${template.name}`);
  });
  
  console.log('\nThis will create/update your .env file with brand-specific configuration.');
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function getCustomConfig() {
  console.log('\n📝 Custom Business Configuration\n');
  
  const config = {};
  
  config.BRAND_NAME = await question('Business name: ');
  config.DEFAULT_BUSINESS_NAME = config.BRAND_NAME;
  config.DEFAULT_BUSINESS_TAGLINE = await question('Business tagline: ');
  config.DEFAULT_META_DESCRIPTION = await question('Business description (for SEO): ');
  config.DEFAULT_KEYWORDS = await question('Keywords (comma-separated): ');
  config.DEFAULT_OPEN_TIME = await question('Opening time (HH:MM, e.g., 09:00): ') || '09:00';
  config.DEFAULT_CLOSE_TIME = await question('Closing time (HH:MM, e.g., 17:00): ') || '17:00';
  config.BRAND_THEME = 'generic';
  
  return config;
}

async function createEnvFile(config) {
  const envPath = path.join(__dirname, '.env');
  const examplePath = path.join(__dirname, '.env.example');
  
  // Read the example file as template
  let envContent = '';
  if (fs.existsSync(examplePath)) {
    envContent = fs.readFileSync(examplePath, 'utf8');
  } else {
    console.log('❌ .env.example not found. Creating basic .env file.');
    envContent = `# Generated by Payload CMS Whitelabel Setup
# Core Payload Configuration
PAYLOAD_SECRET=change-this-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration  
MONGODB_URI=mongodb://localhost:27017/business-cms
DATABASE_URI=mongodb://localhost:27017/business-cms
DB_NAME=business-cms

# Environment
NODE_ENV=development
ENVIRONMENT=development
`;
  }
  
  // Replace template values with brand-specific config
  Object.entries(config).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  });
  
  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Configuration saved to ${envPath}`);
}

function showNextSteps(brandType) {
  console.log('\n🚀 Next Steps:\n');
  console.log('1. Review your .env file and adjust any settings as needed');
  console.log('2. Install dependencies: npm install');
  console.log('3. Start the CMS: npm run dev');
  console.log('4. Access admin at: http://localhost:3001/admin');
  
  if (brandType === 'modernmen') {
    console.log('\n💡 ModernMen-specific features enabled:');
    console.log('   - Custom ModernMen branding and colors');
    console.log('   - Hair salon optimized field labels');
  } else {
    console.log('\n💡 Generic business setup complete:');
    console.log('   - Customizable branding via environment variables');
    console.log('   - Universal business data models');
    console.log('   - Multi-industry compatible');
  }
  
  console.log('\n📖 See WHITELABEL-GUIDE.md for advanced customization options');
  console.log('🎨 Customize admin UI styling in src/admin/customAdminStyles.css');
}

async function main() {
  try {
    showMenu();
    
    const choice = await question('\nSelect option (1-7): ');
    const brandKeys = Object.keys(brandTemplates);
    const selectedKey = brandKeys[parseInt(choice) - 1];
    
    if (!selectedKey) {
      console.log('❌ Invalid selection');
      return;
    }
    
    let config = brandTemplates[selectedKey].config;
    
    if (selectedKey === 'custom') {
      config = await getCustomConfig();
    }
    
    console.log(`\n⚙️  Setting up: ${brandTemplates[selectedKey].name}`);
    
    // Add core configuration
    const coreConfig = {
      ...config,
      PAYLOAD_SECRET: 'change-this-secret-key-' + Math.random().toString(36).substring(7),
      PAYLOAD_PUBLIC_SERVER_URL: 'http://localhost:3001',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      MONGODB_URI: 'mongodb://localhost:27017/business-cms',
      DATABASE_URI: 'mongodb://localhost:27017/business-cms',
      DB_NAME: 'business-cms',
      NODE_ENV: 'development',
      ENVIRONMENT: 'development'
    };
    
    await createEnvFile(coreConfig);
    showNextSteps(selectedKey);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = { brandTemplates, createEnvFile };