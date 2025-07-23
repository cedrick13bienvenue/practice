import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

interface IConfig {
  [key: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    port?: number;
    dialect: Dialect;
  };
}

const config: IConfig = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blogdb',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
  },
  // Add test/production as needed
};

export = config; 