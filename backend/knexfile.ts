import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mssql",
    connection: {
      server: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 1433,
      user: process.env.DB_USER || "sa",
      password: process.env.DB_PASSWORD || "Password123!",
      database: process.env.DB_NAME || "master",
      options: {
        encrypt: false,
        trustServerCertificate: true,
      }
    },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
      extension: "ts"
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
      extension: "ts"
    }
  }
};

export default config;
