import { Hono } from "hono";
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { TokenService } from "../services/token.service.js";
import { MailService } from "../services/mail.service.js";
import { setCookie } from "hono/cookie";

const app = new Hono();

const userService = new UserService(
  new UserRepository(),
  new TokenService(),
  new MailService()
);

app.get("/helth-check", (c) => {
  return c.json({ message: "success" });
});

app.post("/register", async (c) => {
  try {
    const { email, password } = await c.req.json<{
      email: string;
      password: string;
    }>();

    const userData = await userService.register(email, password);

    const { refreshToken, ...data } = userData;

    setCookie(c, "_refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    return c.json({ data });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// app.post("/login", (c) => {});

// app.post("/logout", (c) => {});

// app.get("/me", (c) => {});

// app.get("/refresh", (c) => {});

// app.get("/users", (c) => {});

// app.get("/tokens", (c) => {});

// app.get("/activate/:link", (c) => {});

export const authController = app;
