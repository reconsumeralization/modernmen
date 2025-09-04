/**
 * Environment Variable Validation for Payload CMS
 * Ensures all required environment variables are present and valid
 */

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  invalid: Array<{ var: string; reason: string }>;
  warnings: Array<{ var: string; message: string }>;
}

interface EnvVariableConfig {
  name: string;
  required: boolean;
  validate?: (value: string) => boolean;
  description: string;
  productionOnly?: boolean;
}

const PAYLOAD_ENV_VARS: EnvVariableConfig[] = [
  {
    name: 'PAYLOAD_SECRET',
    required: true,
    validate: (value) => value.length >= 32,
    description: 'Payload CMS secret key (minimum 32 characters)',
  },
  {
    name: 'DATABASE_URL',
    required: true,
    validate: (value) => {
      try {
        const url = new URL(value);
        return ['postgresql:', 'postgres:'].includes(url.protocol);
      } catch {
        return false;
      }
    },
    description: 'PostgreSQL database connection string',
  },
  {
    name: 'PAYLOAD_PUBLIC_SERVER_URL',
    required: false,
    validate: (value) => {
      try {
        new URL(value);
        return value.startsWith('http');
      } catch {
        return false;
      }
    },
    description: 'Public URL for Payload admin panel',
    productionOnly: true,
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: true,
    validate: (value) => {
      try {
        new URL(value);
        return value.startsWith('http');
      } catch {
        return false;
      }
    },
    description: 'Next.js application public URL',
  },
  {
    name: 'NODE_ENV',
    required: true,
    validate: (value) => ['development', 'production', 'test'].includes(value),
    description: 'Node.js environment',
  },
  {
    name: 'DISABLE_PAYLOAD_ADMIN',
    required: false,
    validate: (value) => ['true', 'false'].includes(value),
    description: 'Disable Payload admin panel in production',
    productionOnly: true,
  },
];

const OPTIONAL_ENV_VARS: EnvVariableConfig[] = [
  {
    name: 'NEXTAUTH_SECRET',
    required: false,
    validate: (value) => value.length >= 32,
    description: 'NextAuth.js secret key',
  },
  {
    name: 'NEXTAUTH_URL',
    required: false,
    validate: (value) => {
      try {
        new URL(value);
        return value.startsWith('http');
      } catch {
        return false;
      }
    },
    description: 'NextAuth.js base URL',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    required: false,
    validate: (value) => {
      try {
        new URL(value);
        return value.includes('supabase.co');
      } catch {
        return false;
      }
    },
    description: 'Supabase project URL',
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: false,
    validate: (value) => value.startsWith('eyJ'),
    description: 'Supabase anonymous key',
  },
];

/**
 * Validate all Payload-related environment variables
 */
export function validatePayloadEnvironment(): EnvValidationResult {
  const result: EnvValidationResult = {
    isValid: true,
    missing: [],
    invalid: [],
    warnings: [],
  };

  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

  // Check required variables
  const allVars = [...PAYLOAD_ENV_VARS, ...OPTIONAL_ENV_VARS];

  for (const config of allVars) {
    const value = process.env[config.name];

    // Skip production-only variables in development
    if (config.productionOnly && !isProduction && !isVercel) {
      continue;
    }

    // Check if required variable is missing
    if (config.required && !value) {
      result.missing.push(config.name);
      result.isValid = false;
      continue;
    }

    // Skip validation if variable is not set and not required
    if (!value) {
      if (config.required) {
        result.missing.push(config.name);
        result.isValid = false;
      }
      continue;
    }

    // Validate variable format/value
    if (config.validate && !config.validate(value)) {
      result.invalid.push({
        var: config.name,
        reason: `Invalid format or value for ${config.description}`,
      });
      result.isValid = false;
      continue;
    }

    // Additional checks for production
    if (isProduction || isVercel) {
      if (config.name === 'PAYLOAD_SECRET' && value.length < 64) {
        result.warnings.push({
          var: config.name,
          message: 'Consider using a longer secret key (64+ characters) for production',
        });
      }

      if (config.name === 'DATABASE_URL' && !value.includes('sslmode=require')) {
        result.warnings.push({
          var: config.name,
          message: 'Consider adding SSL parameters to database URL for production',
        });
      }
    }
  }

  // Special cross-validation checks
  if (isProduction || isVercel) {
    const payloadUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL;
    const nextUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (payloadUrl && nextUrl && !payloadUrl.startsWith(nextUrl)) {
      result.warnings.push({
        var: 'PAYLOAD_PUBLIC_SERVER_URL',
        message: 'Payload URL should typically match or be a subdomain of NEXT_PUBLIC_APP_URL',
      });
    }
  }

  return result;
}

/**
 * Validate environment and throw error if invalid
 */
export function validatePayloadEnvironmentStrict(): void {
  const result = validatePayloadEnvironment();

  if (!result.isValid) {
    console.error('❌ Payload Environment Validation Failed');
    console.error('==========================================');

    if (result.missing.length > 0) {
      console.error('\nMissing required variables:');
      result.missing.forEach(name => {
        const config = PAYLOAD_ENV_VARS.find(v => v.name === name);
        console.error(`  - ${name}: ${config?.description || 'Unknown'}`);
      });
    }

    if (result.invalid.length > 0) {
      console.error('\nInvalid variables:');
      result.invalid.forEach(({ var: varName, reason }) => {
        console.error(`  - ${varName}: ${reason}`);
      });
    }

    if (result.warnings.length > 0) {
      console.error('\nWarnings:');
      result.warnings.forEach(({ var: varName, message }) => {
        console.error(`  - ${varName}: ${message}`);
      });
    }

    console.error('\n💡 Fix these issues before deploying to production');
    process.exit(1);
  }

  console.log('✅ Payload Environment Validation Passed');
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(({ var: varName, message }) => {
      console.log(`  - ${varName}: ${message}`);
    });
  }
}

/**
 * Get environment validation summary for logging
 */
export function getEnvValidationSummary(): string {
  const result = validatePayloadEnvironment();

  const summary = [
    `Environment Valid: ${result.isValid ? '✅' : '❌'}`,
    `Missing: ${result.missing.length}`,
    `Invalid: ${result.invalid.length}`,
    `Warnings: ${result.warnings.length}`,
  ];

  if (!result.isValid) {
    summary.push('\nIssues:');
    result.missing.forEach(name => summary.push(`  - Missing: ${name}`));
    result.invalid.forEach(({ var: name }) => summary.push(`  - Invalid: ${name}`));
  }

  return summary.join('\n');
}

// Auto-validate on module import in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Delay validation to allow environment variables to be set
  setTimeout(() => {
    const result = validatePayloadEnvironment();
    if (!result.isValid) {
      console.error('🚨 CRITICAL: Payload environment validation failed in production!');
      console.error(getEnvValidationSummary());
      // Don't exit in production to avoid crashing the app
      // Instead, log the error and continue with degraded functionality
    }
  }, 1000);
}
