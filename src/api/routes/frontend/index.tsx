import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Layout } from "./components/layout";
import { leaderboard } from "./pages/leaderboard";
import { getUsers } from "@/utils/db";
import { round } from "@/utils/functions";
import { counting } from "./pages/counting";
import { user } from "./pages/user";

export const frontend = new Hono();

frontend.get(
  "*",
  jsxRenderer(({ children }) => <Layout children={children} />),
);

frontend.get("/", (c) => {
  const users = getUsers();
  const totalGraphs = users.reduce((acc, user) => acc + user.graphs, 0);
  const totalHours = round(totalGraphs / 12, 2);
  const totalMessages = users.reduce((acc, user) => acc + user.messages, 0);

  return c.render(
    <div class="flex flex-col gap-0.5 text-center">
      <h1 class="text-3xl font-bold tracking-tight">Welcome to Graphical</h1>
      <p>
        <strong>{users.length.toLocaleString()}</strong> users,{" "}
        <strong>{totalGraphs.toLocaleString()}</strong> graphs,{" "}
        <strong>{totalHours.toLocaleString()}</strong> hours,{" "}
        <strong>{totalMessages.toLocaleString()}</strong> messages
      </p>
    </div>,
  );
});

frontend.route("/user", user);
frontend.route("/lb", leaderboard);
frontend.route("/counting", counting);
