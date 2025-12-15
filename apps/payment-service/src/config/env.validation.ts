import { z } from 'zod';

/**
 * Environment variables schema for payment service
 * 
 * This schema provides type-safe runtime validation of environment variables
 * using Zod. It ensures that all required configuration is present and valid
 * before the application starts (fail-fast approach).
 */
export const envSchema = z.object({
  // NATS Configuration
  NATS_URL: z.string().default('nats://localhost:4222').describe(
    'NATS server URL for event-driven communication'
  ),

  // Database Configuration
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').describe(
    'PostgreSQL connection string (postgresql://user:pass@host:port/db)'
  ),

  // Payment Gateway Configuration
  PAYMENT_SUCCESS_RATE: z.string()
    .regex(/^(0(\.\d+)?|1(\.0+)?)$/, 'Must be a number between 0 and 1')
    .default('0.9')
    .describe('Success rate for simulated payment gateway (0.0 to 1.0)'),

  USE_SIMULATED_PAYMENT: z.string()
    .refine((val) => val === 'true' || val === 'false', {
      message: 'Must be "true" or "false"',
    })
    .default('true')
    .describe('Whether to use simulated payment gateway instead of Stripe'),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test'])
    .default('development')
    .describe('Node environment'),
});

/**
 * Validates environment variables against the schema
 * 
 * @throws {Error} If environment variables fail validation
 */
export function validateEnv(env: Record<string, string | undefined>) {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const formattedErrors = zodError.issues
        .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      throw new Error(
        `❌ Invalid environment variables:\n${formattedErrors}\n\nPlease check your .env file or environment configuration.`
      );
    }
    throw error;
  }
}

/**
 * Type for validated environment variables
 */
export type ValidatedEnv = z.infer<typeof envSchema>;
