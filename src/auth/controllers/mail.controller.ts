import { Hono } from "hono";
import { MailService } from "../services/mail.service.js";

const app = new Hono();

app.get("/mail-tester", async (c) => {
  await new MailService().testMail();
  return c.json({ message: "success" });
});

export const mailController = app;
