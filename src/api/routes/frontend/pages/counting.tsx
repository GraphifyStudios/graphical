import { Hono } from "hono";
import { html } from "hono/html";
import colors from "tailwindcss/colors";

export const counting = new Hono().get("/", (c) => {
  return c.render(
    <>
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div class="rounded-lg bg-blue-900/50 p-4 text-center">
          <p>Current count:</p>
          <span
            id="count"
            class="odometer font-['Yantramanav'] text-5xl font-bold sm:text-6xl md:text-7xl"
          >
            0
          </span>
        </div>
        <div class="grid grid-cols-1 gap-3 rounded-lg bg-blue-900/50 p-4 md:grid-cols-2 lg:grid-cols-3">
          {new Array(3).fill(0).map((_, index) => (
            <div class="flex items-center gap-2">
              <img
                src="https://yt3.ggpht.com/87vxtSH644l0tvZWNcTuz418FgR4TOJkbbx0qpEodcgct6V2RqkDaEos4amPaEwqPIPt4J92Mw=s800-c-k-c0x00ffffff-no-rj"
                width={48}
                height={48}
                id={`avatar-${index + 1}`}
                class="rounded-md"
              />
              <div>
                <p
                  id={`count-${index + 1}`}
                  class="font-['Yantramanav'] text-3xl font-bold"
                >
                  0
                </p>
                <p id={`name-${index + 1}`} class="text-xs">
                  ToastedToast
                </p>
              </div>
            </div>
          ))}
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
            fetch("/api/counting")
              .then((res) => res.json())
              .then((data) => {
                document.getElementById("count").textContent = data.count;

                document.getElementById("avatar-1").src =
                  data.lastCounters[0].avatar;
                document.getElementById("count-1").textContent =
                  data.lastCounters[0].count;
                document.getElementById("name-1").textContent =
                  data.lastCounters[0].name;

                document.getElementById("avatar-2").src =
                  data.lastCounters[1].avatar;
                document.getElementById("count-2").textContent =
                  data.lastCounters[1].count;
                document.getElementById("name-2").textContent =
                  data.lastCounters[1].name;

                document.getElementById("avatar-3").src =
                  data.lastCounters[2].avatar;
                document.getElementById("count-3").textContent =
                  data.lastCounters[2].count;
                document.getElementById("name-3").textContent =
                  data.lastCounters[2].name;

                if (chart.series[0].points.length >= 3600)
                  chart.series[0].data[0].remove();
                chart.series[0].addPoint([Date.now(), parseInt(data.count)]);
              });
          }, 2000);
        </script>
      `}
    </>,
  );
});
