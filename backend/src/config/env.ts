import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'ADMIN_PASSWORD', 'CLIENT_URL'] as const;
const missingProductionValues = requiredInProduction.filter((name) => !process.env[name]?.trim());

if (isProduction && missingProductionValues.length > 0) {
  throw new Error(`Missing required production environment variables: ${missingProductionValues.join(', ')}`);
}

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rakta',
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
  adminPassword: process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'local-admin-password'),
  clientUrl: process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:3000',
  serverUrl: process.env.SERVER_URL || 'http://localhost:4000',
  emailHost: process.env.EMAIL_HOST || '',
  emailPort: Number(process.env.EMAIL_PORT || 587),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER || '',
  allowedOrigins: [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].filter(Boolean) as string[],
};
