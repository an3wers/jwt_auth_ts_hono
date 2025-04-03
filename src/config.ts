import { config } from "dotenv";
config();

export const dbConnection = {
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  host: process.env.DB_HOST ?? "",
  port: process.env.DB_PORT ?? "5432",
  database: process.env.DB_NAME ?? "",
} as const;

export const jwtAccessSecret = process.env.JWT_ACCESS_SECRET ?? "";
export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET ?? "";

export const smptConnection = {
  host: process.env.SMTP_HOST ?? "",
  user: process.env.SMTP_USER ?? "",
  password: process.env.SMTP_PASSWORD ?? "",
} as const;
