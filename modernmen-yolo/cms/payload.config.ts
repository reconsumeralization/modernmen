import { buildConfig } from 'payload/config';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { slateEditor } from '@payloadcms/richtext-slate';
import path from 'path';

// Collections
import { Users } from './src/collections/Users';
import { Appointments } from './src/collections/Appointments';
import { Services } from './src/collections/Services';
import { Customers } from './src/collections/Customers';
import { Staff } from './src/collections/Staff';
import { Notifications } from './src/collections/Notifications';
import { Settings } from './src/collections/Settings';
import { Barbers } from './src/collections/Barbers';
import { Gallery } from './src/collections/Gallery';
import { Reviews } from './src/collections/Reviews';
import { Pages } from './src/collections/Pages';

// Social Media Collections
import { BarberSocial } from './src/collections/BarberSocial';
import { BarberComments } from './src/collections/BarberComments';
import { BarberRatings } from './src/collections/BarberRatings';
import { BarberChallenges } from './src/collections/BarberChallenges';

// Loyalty & Rewards Collections
import { LoyaltyProgram } from './src/collections/LoyaltyProgram';
import { CustomerLoyalty } from './src/collections/CustomerLoyalty';
import { RewardsOffers } from './src/collections/RewardsOffers';

// Globals
import { SiteSettings } from './src/globals/SiteSettings';

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: `- ModernMen Admin`,
      ogImage: '/modernmen-logo-dark.svg',
      favicon: '/modernmen-logo-dark.svg',
    },
    css: path.resolve(__dirname, 'src/admin/customAdminStyles.css'),
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || process.env.MONGODB_URI || '',
  }),
  collections: [
    Users,
    Appointments,
    Services,
    Customers,
    Staff,
    Notifications,
    Settings,
    Barbers,
    Gallery,
    Reviews,
    Pages,
    
    // Social Media Collections
    BarberSocial,
    BarberComments,
    BarberRatings,
    BarberChallenges,
    
    // Loyalty & Rewards Collections
    LoyaltyProgram,
    CustomerLoyalty,
    RewardsOffers,
  ],
  globals: [
    SiteSettings,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    // Add your plugins here
  ],
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ].filter(Boolean),
});
