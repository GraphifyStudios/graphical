import { Hono } from "hono";
import { users } from "./users";
import { votes } from "./votes";

export const api = new Hono();
api.route("/users", users);
api.route("/votes", votes);
