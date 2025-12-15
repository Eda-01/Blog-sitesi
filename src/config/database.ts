import knex from "knex";
import dotenv from "dotenv";
import { parse } from "node:path";

dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "blog_odev",
  },
});


export default db;