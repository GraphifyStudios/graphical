import { Hono } from "hono";
import { getUser, getUsers, type User } from "@/utils/db";

export const users = new Hono();

const formatUser = (user: User) => ({
  id: user.id,
  name: user.name,
  graphs: user.graphs,
  hours: user.graphs / 12,
  messages: user.messages,
  lastMessageTime: user.lastMessageTime,
});

users.get("/", async (c) => {
  const users = getUsers();
  return c.json(users.map(formatUser));
});

users.get("/:id", async (c) => {
  const user = getUser(c.req.param("id"));
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json(formatUser(user));
});
