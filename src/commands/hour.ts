import type { Command } from "@/command-handler";
import { ensureUser } from "@/utils/db";
import { round } from "@/utils/functions";

export default {
  name: "hour",
  description: "Check how many graphs and hours you've gained in the past hour",
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    const lastHourly = user.lastHourly;
    const graphsGained = user.graphs - lastHourly.graphs;
    const hoursGained = round(user.graphs / 12, 2) - lastHourly.hours;

    message.reply(
      `${
        message.author.name
      }, you've gained ${graphsGained.toLocaleString()} graphs and ${hoursGained.toLocaleString()} hours in the past hour.`
    );
  },
} satisfies Command;
