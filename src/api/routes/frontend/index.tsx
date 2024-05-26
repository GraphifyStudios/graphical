import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Layout } from "./components/layout";

export const frontend = new Hono();

frontend.get(
  "*",
  jsxRenderer(({ children }) => <Layout children={children} />)
);

frontend.get("/", (c) => {
  return c.render(<h1 className="text-3xl font-bold">hello world!</h1>);
});
