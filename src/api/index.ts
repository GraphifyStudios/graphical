import { Hono } from "hono";
import { env } from "@/utils/env";
import { api } from "./routes/api";

export async function startApi() {
  console.log("Starting API server...");

  const app = new Hono();

  app.get("/", (c) => {
    return c.text("Hello World!");
  });

  app.route("/api", api);

  Bun.serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`API server listening on port ${env.PORT}!`);
}
