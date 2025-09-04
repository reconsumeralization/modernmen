import express from 'express';
import payload from 'payload';
import path from 'path';

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();

// Redirect root to Next.js
app.get('/', (req, res) => {
  res.redirect(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
});

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key',
    mongodbURL: process.env.MONGODB_URI || process.env.DATABASE_URI || `mongodb://localhost:27017/${process.env.DB_NAME || 'business-cms'}`,    
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(process.env.PORT || 3001, () => {
    console.log(`CMS server running on port ${process.env.PORT || 3001}`);
  });
};

start();
