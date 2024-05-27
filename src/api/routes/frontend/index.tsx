import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Layout } from "./components/layout";
import { leaderboard } from "./pages/leaderboard";
import { counting } from "./pages/counting";
import { user } from "./pages/user";
import { commands } from "./pages/commands";
import { index } from "./pages/index";

export const frontend = new Hono();

frontend.get(
  "*",
  jsxRenderer(({ children }) => <Layout children={children} />),
);

frontend.route("/", index);
frontend.route("/commands", commands);
frontend.route("/lb", leaderboard);
frontend.route("/user", user);
frontend.route("/counting", counting);
