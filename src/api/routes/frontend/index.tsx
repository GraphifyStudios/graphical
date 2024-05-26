import { Hono } from "hono";

export const frontend = new Hono();

frontend.get("/", (c) => {
  return c.html(
    <html>
      <body>
        hello <strong>world</strong>!
      </body>
    </html>
  );
});
