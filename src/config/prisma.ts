import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


const getDatabaseUrl = (): string => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "blog_odev";
  
  return `postgresql://${user}:${password}@${host}:${port}/${database}`;
};

const databaseUrl = getDatabaseUrl();
process.env.DATABASE_URL = databaseUrl;


const pool = new Pool({
  connectionString: databaseUrl,
});


const adapter = new PrismaPg(pool);


export const prisma = new (PrismaClient as any)({
  adapter,
});


