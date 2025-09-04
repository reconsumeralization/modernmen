#!/usr/bin/env ts-node

/**
 * generate-payload-types.ts
 *
 * Generates TypeScript types for all Payload collections using the Payload API.
 * This script writes the generated types to src/payload-types.ts.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import payloadConfig from '../payload.config';

async function generate() {
  try {
    console.log('🔄 Generating Payload types...');
    // generateTypes returns a string containing the type definitions
    const types = await generateTypes(payloadConfig);
    const outPath = path.resolve(__dirname, '..', 'src', 'payload-types.ts');
    // Ensure we write a string (or Buffer) to the file
    fs.writeFileSync(outPath, String(types));
    console.log('✅ Payload types written to', outPath);
  } catch (err) {
    console.error('❌ Failed to generate Payload types:', err);
    process.exit(1);
  }
}

// Export main function as default
export default generate;

// Run if called directly
if (require.main === module) {
  generate();
}

// Placeholder implementation - this would need to be properly implemented
function generateTypes(payloadConfig: Promise<import("payload").SanitizedConfig>) {
  throw new Error('Function not implemented.');
}

