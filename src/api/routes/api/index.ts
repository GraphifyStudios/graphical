import { Hono } from "hono";
import { users } from "./users";

export const api = new Hono();
api.route("/users", users);
