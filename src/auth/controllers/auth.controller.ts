import { Hono } from "hono";

const app = new Hono();

app.get("/helth-check", (c) => {
  return c.json({ message: "success" });
});

app.post("/register", (c) => {});

app.post("/login", (c) => {});

app.post("/logout", (c) => {});

app.get("/me", (c) => {});

app.get("/refresh", (c) => {});

app.get("/users", (c) => {});

app.get("/tokens", (c) => {});

app.get("/activate/:link", (c) => {});

export const authController = app;
