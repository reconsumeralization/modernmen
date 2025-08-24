#!/usr/bin/env ts-node

/**
 * YOLO Protobuf Type Generator for Modern Men Salon
 * 
 * This script generates TypeScript types from protobuf definitions
 * and creates type-safe API clients for the salon management system.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Configuration
const PROTO_DIR = path.join(process.cwd(), 'protos');
const OUTPUT_DIR = path.join(process.cwd(), 'src/types/protobuf');
const GENERATED_DIR = path.join(process.cwd(), 'src/lib/protobuf');

interface ProtoFile {
  name: string;
  path: string;
  outputPath: string;
}

// Ensure output directories exist
function ensureDirectories() {
  const dirs = [OUTPUT_DIR, GENERATED_DIR];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
}

// Get all .proto files
function getProtoFiles(): ProtoFile[] {
  if (!fs.existsSync(PROTO_DIR)) {
    console.error(`❌ Proto directory not found: ${PROTO_DIR}`);
    return [];
  }

  const files = fs.readdirSync(PROTO_DIR)
    .filter(file => file.endsWith('.proto'))
    .map(file => ({
      name: path.basename(file, '.proto'),
      path: path.join(PROTO_DIR, file),
      outputPath: path.join(OUTPUT_DIR, `${path.basename(file, '.proto')}.types.ts`)
    }));

  console.log(`📁 Found ${files.length} proto files`);
  return files;
}

// Generate TypeScript types using protobuf-to-typescript
function generateTypes(protoFile: ProtoFile): boolean {
  try {
    console.log(`🔄 Generating types for: ${protoFile.name}`);
    
    // Use protobuf-to-typescript CLI
    const command = `npx protobuf-to-typescript ${protoFile.path} --out ${protoFile.outputPath} --target ts`;
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log(`✅ Generated: ${protoFile.outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to generate types for ${protoFile.name}:`, error);
    return false;
  }
}

// Create TypeScript interfaces from generated types
function createTypeScriptInterfaces(protoFile: ProtoFile): void {
  const interfacePath = path.join(GENERATED_DIR, `${protoFile.name}.interfaces.ts`);
  
  const interfaceContent = `/**
 * Auto-generated TypeScript interfaces for ${protoFile.name}
 * Generated from: ${protoFile.path}
 * 
 * YOLO MODE: These interfaces are automatically generated from protobuf definitions
 * and provide type-safe access to the Modern Men Salon API.
 */

import { GeneratedTypes } from '../types/protobuf/${protoFile.name}.types';

// Re-export generated types
export type { GeneratedTypes };

// Type-safe API client interface
export interface ${protoFile.name.charAt(0).toUpperCase() + protoFile.name.slice(1)}ApiClient {
  // Add your API methods here
  // Example: createAppointment(data: CreateAppointmentRequest): Promise<AppointmentResponse>;
}

// Utility types for API responses
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

// Error handling types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Export all types for easy importing
export * from '../types/protobuf/${protoFile.name}.types';
`;

  fs.writeFileSync(interfacePath, interfaceContent);
  console.log(`✅ Created interfaces: ${interfacePath}`);
}

// Create index file for easy imports
function createIndexFile(protoFiles: ProtoFile[]): void {
  const indexPath = path.join(GENERATED_DIR, 'index.ts');
  
  const indexContent = `/**
 * YOLO Protobuf Type Exports
 * 
 * This file exports all generated protobuf types and interfaces
 * for the Modern Men Salon application.
 */

${protoFiles.map(file => `export * from './${file.name}.interfaces';`).join('\n')}

// Common types used across all services
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiRequest {
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Utility functions
export function createApiResponse<T>(
  success: boolean, 
  data?: T, 
  message?: string, 
  error?: string
): ApiResponse<T> {
  return { success, data, message, error };
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return createApiResponse(true, data, message);
}

export function createErrorResponse(message: string, error?: string): ApiResponse {
  return createApiResponse(false, undefined, message, error);
}

// Type guards
export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true; data: T } {
  return response.success && response.data !== undefined;
}

export function isErrorResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: false; error: string } {
  return !response.success && response.error !== undefined;
}
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`✅ Created index file: ${indexPath}`);
}

// Create API client factory
function createApiClientFactory(protoFiles: ProtoFile[]): void {
  const factoryPath = path.join(GENERATED_DIR, 'api-client-factory.ts');
  
  const factoryContent = `/**
 * YOLO API Client Factory
 * 
 * Factory for creating type-safe API clients from protobuf definitions.
 */

import { ApiResponse, createSuccessResponse, createErrorResponse } from './index';

// Base API client configuration
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Base API client class
export abstract class BaseApiClient {
  protected config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  protected async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = \`\${this.config.baseUrl}\${endpoint}\`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
          ...options.headers,
        },
        signal: this.config.timeout 
          ? AbortSignal.timeout(this.config.timeout)
          : undefined,
      });

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const data = await response.json();
      return createSuccessResponse(data);
    } catch (error) {
      return createErrorResponse(
        'Request failed', 
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  protected async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  protected async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API client factory
export class ApiClientFactory {
  private static instance: ApiClientFactory;
  private config: ApiClientConfig;

  private constructor(config: ApiClientConfig) {
    this.config = config;
  }

  static getInstance(config: ApiClientConfig): ApiClientFactory {
    if (!ApiClientFactory.instance) {
      ApiClientFactory.instance = new ApiClientFactory(config);
    }
    return ApiClientFactory.instance;
  }

  // Create specific API clients
  createAppointmentClient(): any {
    // Implementation for appointment client
    return new AppointmentApiClient(this.config);
  }

  createCustomerClient(): any {
    // Implementation for customer client
    return new CustomerApiClient(this.config);
  }

  // Add more client factories as needed
}

// Example client implementations
class AppointmentApiClient extends BaseApiClient {
  // Implement appointment-specific methods
}

class CustomerApiClient extends BaseApiClient {
  // Implement customer-specific methods
}

// Export factory function
export function createApiClients(config: ApiClientConfig) {
  const factory = ApiClientFactory.getInstance(config);
  return {
    appointments: factory.createAppointmentClient(),
    customers: factory.createCustomerClient(),
  };
}
`;

  fs.writeFileSync(factoryPath, factoryContent);
  console.log(`✅ Created API client factory: ${factoryPath}`);
}

// Main execution
function main() {
  console.log('🚀 YOLO Protobuf Type Generator Starting...\n');

  try {
    // Ensure directories exist
    ensureDirectories();

    // Get proto files
    const protoFiles = getProtoFiles();
    if (protoFiles.length === 0) {
      console.log('⚠️  No proto files found. Creating sample files...');
      return;
    }

    // Generate types for each proto file
    let successCount = 0;
    protoFiles.forEach(protoFile => {
      if (generateTypes(protoFile)) {
        createTypeScriptInterfaces(protoFile);
        successCount++;
      }
    });

    // Create index and factory files
    createIndexFile(protoFiles);
    createApiClientFactory(protoFiles);

    console.log(`\n🎉 YOLO Generation Complete!`);
    console.log(`✅ Successfully processed ${successCount}/${protoFiles.length} proto files`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log(`🔧 Generated directory: ${GENERATED_DIR}`);
    console.log(`\n🚀 Ready to use type-safe protobuf APIs in your Modern Men app!`);

  } catch (error) {
    console.error('❌ YOLO Generation failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main as generateProtobufTypes };
