import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mode: process.env.MODE || 'development',
  devPort: process.env.DEV_PORT || 3001,
  prodPort: process.env.PRO_PORT || 444,
  domain: process.env.DOMAIN || 'localhost',
};