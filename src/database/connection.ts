import { dbConnection } from "../config.js";
import pg from "pg";

export class DatabaseConnection {
  private static pool: pg.Pool;

  static async init() {
    this.pool = new pg.Pool({
      user: dbConnection.user,
      password: dbConnection.password,
      host: dbConnection.host,
      port: Number(dbConnection.port),
      database: dbConnection.database,
    });

    try {
      const client = await this.pool.connect();
      console.log("Database is connected");
      client.release();
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
  }

  static getPool() {
    if (!this.pool) {
      throw new Error("Database not initialized");
    }
    return this.pool;
  }
}
