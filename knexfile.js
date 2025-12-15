import dotenv from 'dotenv';


dotenv.config();

export default {
    development: {
    client: 'pg',
    connection: {
      database: process.env.BD_NAME,
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    migrations: {
      directory: './migrations'
    }
  }
};