import { Hono } from "hono";
import { env } from "@/utils/env";
import { api } from "./routes/api";
import { frontend } from "./routes/frontend";
import { serveStatic } from "hono/bun";
import { join } from "path";

export async function startApi() {
  console.log("Starting API server...");

  const app = new Hono();

  app.get(
    "/static/*",
    serveStatic({
      root: "./",
      rewriteRequestPath: (path) => path.replace("/static", "/src/api/static"),
    })
  );
  app.route("/", frontend);
  app.route("/api", api);

  Bun.serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`API server listening on port ${env.PORT}!`);
}
