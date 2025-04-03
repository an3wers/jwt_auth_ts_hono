import { Hono } from "hono";
import { MailService } from "../services/mail.service.js";

const app = new Hono();

app.get("/mail-tester", async (c) => {
  try {
    await new MailService().testMail();
    return c.json({ message: "success" });
  } catch (error) {
    console.error(["MAIL-CONTROLLER: "], error);
    throw error;
  }
});

export const mailController = app;
