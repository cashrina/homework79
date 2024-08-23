import mysql, { Connection } from 'mysql2/promise';

const databaseConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'items'
};

let connection: Connection;

const mysqlDb = {

  init: async () => {
    try {
      connection = await mysql.createConnection(databaseConfig);
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  },

  getConnection: () => {
    if (!connection) {
      throw new Error('Database connection has not been initialized.');
    }
    return connection;
  }
};

export default mysqlDb;