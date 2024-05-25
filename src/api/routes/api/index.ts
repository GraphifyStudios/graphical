import { Hono } from "hono";
import { users } from "./users";
import { votes } from "./votes";
import { getCount, getLastCounters } from "@/utils/db";

export const api = new Hono();

api.route("/users", users);
api.route("/votes", votes);

api.get("/counting", (c) => {
  const count = getCount();
  const lastCounters = getLastCounters();
  return c.json({ count, lastCounters });
});
