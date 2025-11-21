import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 43100,
  mongoUri: process.env.MONGODB_URI || 'mongodb://mongo:27017/authentinet',
  jwtSecret: process.env.JWT_SECRET || 'replace-this-secret',
  recaptchaSecret: process.env.RECAPTCHA_SECRET || '',
  environment: process.env.NODE_ENV || 'development'
};
