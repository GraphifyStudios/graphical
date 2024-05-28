import { Hono } from "hono";
import { users } from "./users";
import { votes } from "./votes";
import { getCount, getLastCounters, getStream, getUsers } from "@/utils/db";
import { round } from "@/utils/functions";

export const api = new Hono();

api.route("/users", users);
api.route("/votes", votes);

api.get("/counting", (c) => {
  const count = getCount();
  const lastCounters = getLastCounters();
  return c.json({ count, lastCounters });
});

api.get("/total", (c) => {
  const users = getUsers();
  const totalGraphs = users.reduce((acc, user) => acc + user.graphs, 0);
  const totalHours = round(totalGraphs / 12, 2);
  const totalMessages = users.reduce((acc, user) => acc + user.messages, 0);

  return c.json({
    totalUsers: users.length,
    totalGraphs,
    totalHours,
    totalMessages,
  });
});

api.get("/stream", (c) => {
  const stream = getStream();
  return c.json({ currentUser: stream ?? null });
});
