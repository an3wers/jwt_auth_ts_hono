import { Hono } from "hono";
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { TokenService } from "../services/token.service.js";
import { MailService } from "../services/mail.service.js";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { HTTPException } from "hono/http-exception";
import type { UserRights } from "../constants.js";

const app = new Hono();

const userService = new UserService(
  new UserRepository(),
  new TokenService(),
  new MailService()
);

// TODO: Добавить ZOD валидацию к requests

app.get("/helth-check", (c) => {
  return c.json({ message: "success" });
});

app.post("/register", async (c) => {
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
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json<{
    email: string;
    password: string;
  }>();

  const userData = await userService.login(email, password);

  const { refreshToken, ...data } = userData;

  setCookie(c, "_refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return c.json({ data });
});

app.post("/logout", async (c) => {
  const refreshToken = getCookie(c, "_refreshToken");

  if (!refreshToken) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  await userService.logout(refreshToken);
  deleteCookie(c, "_refreshToken");
  return c.json({ data: "ok" });
});

app.get("/me", authMiddleware, async (c) => {
  const id = c.get("userId" as never) as string;

  const user = await userService.getMe(id);

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return c.json({ data: user });
});

app.get("/refresh", async (c) => {
  const token = getCookie(c, "_refreshToken");

  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const { accessToken, refreshToken } = await userService.refresh(token);

  setCookie(c, "_refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  return c.json({ data: accessToken });
});

app.get("/users", authMiddleware, async (c) => {
  const users = await userService.getUsers();
  return c.json({ data: users });
});

app.patch("/users/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const { email, isActivated, rights, newPassword, oldPassword } =
    await c.req.json<{
      email?: string;
      isActivated?: boolean;
      rights?: UserRights[];
      oldPassword?: string;
      newPassword?: string;
    }>();

  const updatedUser = await userService.updateUser({
    id,
    email,
    isActivated,
    rights,
    newPassword,
    oldPassword,
  });

  return c.json({ data: updatedUser });
});

// app.get("/tokens", (c) => {});

// app.get("/activate/:link", (c) => {});

export const authController = app;
