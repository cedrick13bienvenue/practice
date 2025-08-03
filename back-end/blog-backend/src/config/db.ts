import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Function to determine which database to use based on environment
const getDatabaseConfig = () => {
  const isTest = process.env.NODE_ENV === 'test' || process.argv.some(arg => arg.includes('test'));
  
  console.log('🔍 Database Config Debug:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  isTest:', isTest);
  console.log('  TEST_DATABASE:', process.env.TEST_DATABASE);
  console.log('  DB_NAME:', process.env.DB_NAME);

  if (isTest) {
    return {
      database: process.env.TEST_DATABASE || 'blogAPI-Test',
      username: process.env.TEST_USERNAME || 'postgres',
      password: process.env.TEST_PASSWORD || 'cedrique13',
      host: process.env.TEST_HOST || 'localhost',
      port: Number(process.env.TEST_PORT || '5432'),
    };
  }

  return {
    database: process.env.DB_NAME || 'blogdb',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'cedrique13',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || '5432'),
  };
};

// Create sequelize instance dynamically
let sequelizeInstance: Sequelize | null = null;

export const getSequelize = () => {
  if (!sequelizeInstance) {
    const config = getDatabaseConfig();
    console.log(`🔌 Creating Sequelize connection to: ${config.database}`);
    sequelizeInstance = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: 'postgres',
      logging: false,
    });
  }
  return sequelizeInstance;
};

// For backward compatibility
export const sequelize = getSequelize();

export const connectDB = async () => {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    const config = getDatabaseConfig();
    console.log(`✅ PostgreSQL connected successfully to ${config.database}`);
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
    throw err;
  }
};
