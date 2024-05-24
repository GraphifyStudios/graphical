import { Hono } from "hono";
import { getUser, getUsers } from "../../../utils/db";

export const users = new Hono();

users.get("/", async (c) => {
  const users = getUsers();
  return c.json(users);
});

users.get("/:id", async (c) => {
  const user = getUser(c.req.param("id"));
  return c.json(user);
});
