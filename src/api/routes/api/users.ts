import { Hono } from "hono";
import { getUser, getUsers, type User } from "@/utils/db";
import { round } from "@/utils/functions";

export const users = new Hono();

const formatUser = (user: User) => ({
  id: user.id,
  name: user.name,
  avatar: user.avatar,
  graphs: user.graphs,
  hours: round(user.graphs / 12, 2),
  messages: user.messages,
  lastMessageTime: user.lastMessageTime,
  gained: {
    hour: {
      graphs: user.graphs - user.lastHourly.graphs,
      hours: round(user.graphs / 12, 2) - user.lastHourly.hours,
    },
    day: {
      graphs: user.graphs - user.lastDaily.graphs,
      hours: round(user.graphs / 12, 2) - user.lastDaily.hours,
    },
  }
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
