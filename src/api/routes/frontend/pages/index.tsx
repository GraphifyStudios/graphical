import { getStream } from "@/utils/db";
import { Hono } from "hono";
import { html } from "hono/html";

export const index = new Hono().get("/", (c) => {
  const stream = getStream();

  return c.render(
    <>
      <div class="flex flex-col gap-2 text-center">
        <div class="flex flex-col gap-0.5 text-center">
          <h1 class="text-3xl font-bold tracking-tight">
            Welcome to Graphical
          </h1>
          <p>
            <strong id="users" class="odometer font-['Yantramanav']">
              0
            </strong>{" "}
            users,{" "}
            <strong id="graphs" class="odometer font-['Yantramanav']">
              0
            </strong>{" "}
            graphs,{" "}
            <strong id="hours" class="odometer font-['Yantramanav']">
              0
            </strong>{" "}
            hours,{" "}
            <strong id="messages" class="odometer font-['Yantramanav']">
              0
            </strong>{" "}
            messages
          </p>
        </div>
        <div class="flex flex-col items-center justify-center gap-2">
          <h2 class="text-lg font-bold tracking-tight">Featured user:</h2>
          {stream ? (
            <div class="flex items-center gap-2">
              <img
                src={stream.avatar}
                alt={stream.name}
                width={32}
                height={32}
                class="rounded-md"
              />
              <p class="text-xl">{stream.name}</p>
            </div>
          ) : (
            <p class="max-w-md text-pretty">
              No one yet. Buy a stream shoutout for 100 graphs by running{" "}
              <code class="rounded-lg bg-neutral-900 p-1.5">!buy stream</code>{" "}
              on any of Graphify's streams!
            </p>
          )}
        </div>
      </div>
      <link rel="stylesheet" href="/static/odometer.css" />
      <script src="/static/odometer.js" />
      {html`
        <script>
          setInterval(() => {
            fetch("/api/total")
              .then((res) => res.json())
              .then((data) => {
                document.getElementById("users").textContent = data.totalUsers;
                document.getElementById("graphs").textContent =
                  data.totalGraphs;
                document.getElementById("hours").textContent = data.totalHours;
                document.getElementById("messages").textContent =
                  data.totalMessages;
              });
          }, 2000);
        </script>
      `}
    </>,
  );
});
