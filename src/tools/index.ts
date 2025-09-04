// Tools Module Exports
// This module contains development and deployment tools for the Modern Men Hair Salon system

// Deployment tools
export { default as deployVercel } from './deploy-vercel'

// Documentation tools
export { default as exportDocs } from './export-docs'

// Type generation tools
export { default as generatePayloadTypes } from './generate-payload-types'

// Development tools
export { default as protobufGtmEditor } from './protobuf-gtm-editor'
export { default as runLintFix } from './run-lint-fix'

// Database tools
export { default as seedDatabase } from './seed-database'

// Tool utilities and types
export * from './types'

// Re-export for convenience
export const tools = {
  deployVercel: () => import('./deploy-vercel').then(m => m.default()),
  exportDocs: () => import('./export-docs').then(m => m.default()),
  generatePayloadTypes: () => import('./generate-payload-types').then(m => m.default()),
  protobufGtmEditor: () => import('./protobuf-gtm-editor').then((m: any) => new m.default()),
  runLintFix: () => import('./run-lint-fix').then(m => m.default()),
  seedDatabase: () => import('./seed-database').then(m => m.default())
}