import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authController } from "./auth/controllers/auth.controller.js";
import { mailController } from "./auth/controllers/mail.controller.js";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { config } from "dotenv";
import { DatabaseConnection } from "./database/connection.js";
import { HTTPException } from "hono/http-exception";

config();

const app = new Hono();

app.use(prettyJSON());
app.use("*", logger());

app.use("/api/*", cors());

await DatabaseConnection.init();

// mailController пока не работает, нужно подлючить домен к mail-серверу
app.route("/api/mail", mailController);
app.route("/api/auth", authController);

app.onError((err, c) => {
  console.error(`${err}`);

  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }

  return c.json({ error: "Internal Server Error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) ?? 3005,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
