import { Hono } from "hono";
import { getUser, getUsers } from "@/utils/db";

export const users = new Hono();

users.get("/", async (c) => {
  const users = getUsers();
  return c.json(users);
});

users.get("/:id", async (c) => {
  const user = getUser(c.req.param("id"));
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(user);
});
