import { Hono } from "hono";

export const frontend = new Hono();

frontend.get("/", (c) => {
	return c.text("Hello World!");
})
