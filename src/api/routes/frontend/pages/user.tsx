import { getUser } from "@/utils/db";
import { Hono } from "hono";
import { html } from "hono/html";
import colors from "tailwindcss/colors";

export const user = new Hono().get("/:id", (c) => {
  const id = c.req.param("id");
  const user = getUser(id);
  if (!user) return c.notFound();

  return c.render(
    <>
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div class="flex flex-col gap-2 rounded-lg bg-blue-900/50 p-4 text-center">
          <div class="flex flex-col items-center justify-center gap-2 text-center">
            <img
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              class="rounded-full"
            />
            <h1 class="text-xl font-medium">{user.name}</h1>
          </div>
          <span
            id="graphs"
            class="odometer font-['Yantramanav'] text-5xl font-bold sm:text-6xl md:text-7xl"
          >
            0
          </span>
          <p class="text-xs">Graphs</p>
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div class="flex flex-col gap-1 rounded-lg bg-blue-900/50 p-4 text-center">
            <span id="messages" class="odometer font-['Yantramanav'] text-4xl">
              0
            </span>
            <p class="text-xs">Messages</p>
          </div>
          <div class="flex flex-col gap-1 rounded-lg bg-blue-900/50 p-4 text-center">
            <span id="hours" class="odometer font-['Yantramanav'] text-4xl">
              0
            </span>
            <p class="text-xs">Hours</p>
          </div>
        </div>
        <div class="rounded-lg bg-blue-900/50 p-4">
          <div id="chart" />
        </div>
      </div>
      <link rel="stylesheet" href="/static/odometer.css" />
      <script src="/static/odometer.js" />
      <script src="https://code.highcharts.com/10.3.3/highcharts.js" />
      {html`
        <script>
          const chart = new Highcharts.chart({
            chart: {
              renderTo: "chart",
              type: "line",
              zoomType: "x",
              panning: true,
              panKey: "shift",
              animation: true,
              backgroundColor: "transparent",
              plotBorderColor: "transparent",
              resetZoomButton: {
                theme: {
                  fill: "#232323",
                  stroke: "${colors.blue[500]}",
                  r: 5,
                  style: {
                    color: "${colors.blue[500]}",
                    fontSize: "12px",
                    fontWeight: "bold",
                  },
                  states: {
                    hover: {
                      fill: "${colors.blue[500]}",
                      style: {
                        color: "#232323",
                      },
                    },
                  },
                },
              },
            },
            title: {
              text: "",
            },
            xAxis: {
              type: "datetime",
              tickPixelInterval: 500,
              labels: {
                style: {
                  color: "${colors.blue[800]}",
                  fontFamily: '"Inter", sans-serif',
                },
              },
              gridLineColor: "${colors.blue[800]}",
              lineColor: "${colors.blue[800]}",
              minorGridLineColor: "${colors.blue[800]}",
              tickColor: "${colors.blue[800]}",
              title: {
                style: {
                  color: "${colors.blue[800]}",
                },
              },
            },
            yAxis: {
              title: {
                text: "",
              },
              labels: {
                style: {
                  color: "${colors.blue[800]}",
                  fontFamily: '"Inter", sans-serif',
                },
              },
              gridLineColor: "${colors.blue[800]}",
              lineColor: "${colors.blue[800]}",
              minorGridLineColor: "${colors.blue[800]}",
              tickColor: "${colors.blue[800]}",
            },
            credits: {
              enabled: false,
            },
            series: [
              {
                showInLegend: false,
                name: "",
                marker: { enabled: false },
                color: "${colors.blue[500]}",
                lineWidth: 4,
              },
            ],
          });

          setInterval(() => {
            fetch("/api/users/${id}")
              .then((res) => res.json())
              .then((data) => {
                document.getElementById("graphs").textContent = data.graphs;
                document.getElementById("messages").textContent = data.messages;
                document.getElementById("hours").textContent = data.hours;

                if (chart.series[0].points.length >= 3600)
                  chart.series[0].data[0].remove();
                chart.series[0].addPoint([Date.now(), parseInt(data.graphs)]);
              });
          }, 2000);
        </script>
      `}
    </>,
  );
});
