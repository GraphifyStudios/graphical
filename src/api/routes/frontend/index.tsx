import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

export const frontend = new Hono();

frontend.get(
  "*",
  jsxRenderer(({ children }) => (
    <html>
      <head>
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  ))
);

frontend.get("/", (c) => {
  return c.render(<h1 className="text-3xl font-bold">hello world!</h1>);
});
