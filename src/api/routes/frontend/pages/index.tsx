import { Hono } from "hono";
import { html } from "hono/html";

export const index = new Hono().get("/", (c) => {
  return c.render(
    <>
      <div class="flex flex-col gap-0.5 text-center">
        <h1 class="text-3xl font-bold tracking-tight">Welcome to Graphical</h1>
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
