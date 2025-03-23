import { cleanEnv, str, port, url, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGODB_URI: url(),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  SMTP_HOST: str({ default: 'smtp.gmail.com' }),
  SMTP_PORT: port({ default: 587 }),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  FROM_EMAIL: str(),
  GOOGLE_CLIENT_ID: str({ default: '' }),
  GOOGLE_CLIENT_SECRET: str({ default: '' }),
  GOOGLE_CALLBACK_URL: url({ default: '' }),
  CLIENT_URL: url(),
  SERVER_URL: url(),
  JWT_ACCESS_TOKEN_SECRET: str(),
  JWT_REFRESH_TOKEN_SECRET: str(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: num(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: num(),
  VERIFICATION_EXPIRATION_TIME: num(),
  DB_HOST: str({ default: 'localhost' }),
  DB_PORT: num({ default: 5432 }),
  DB_USER: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),
  REDIS_HOST: str(),
  REDIS_PORT: num(),
});

export const config = {
  port: env.PORT,
  database: {
    url: env.MONGODB_URI,
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
  },
  jwt: {
    accessTokenSecret: env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenExpiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  },
  client: {
    url: env.CLIENT_URL,
  },
  cors: {
    origin: env.CLIENT_URL,
  },
  server: {
    url: env.SERVER_URL,
  },
  nodeEnv: env.NODE_ENV,
  email: {
    smtp: {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    from: env.FROM_EMAIL,
  },
  google: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackUrl: env.GOOGLE_CALLBACK_URL,
  },
  verification: {
    expirationTime: env.VERIFICATION_EXPIRATION_TIME,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
} as const;
