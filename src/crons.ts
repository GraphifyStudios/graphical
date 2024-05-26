import { CronJob } from "cron";
import { getUsers, setUser } from "./utils/db";
import { round } from "./utils/functions";

export function startCrons() {
  const hourlyCron = new CronJob(
    "0 * * * *",
    () => {
      for (const user of getUsers()) {
        user.lastHourly = {
          graphs: user.graphs,
          hours: round(user.graphs / 12, 2),
        };
        setUser(user.id, user);
      }
    },
    null,
    true,
    "Africa/Abidjan"
  );
  hourlyCron.start();

  const dailyCron = new CronJob(
    "0 * * * *",
    () => {
      for (const user of getUsers()) {
        user.lastDaily = {
          graphs: user.graphs,
          hours: round(user.graphs / 12, 2),
        };
        setUser(user.id, user);
      }
    },
    null,
    true,
    "Africa/Abidjan"
  );
  dailyCron.start();
}
