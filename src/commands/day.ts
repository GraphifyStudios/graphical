import type { Command } from "@/command-handler";
import { ensureUser } from "@/utils/db";
import { round } from "@/utils/functions";

export default {
  name: "day",
  description: "Check how many graphs and hours you've gained in the past day",
  aliases: ["24hours", "24h", "today"],
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    const lastDaily = user.lastDaily;
    const graphsGained = user.graphs - lastDaily.graphs;
    const hoursGained = round(user.graphs / 12, 2) - lastDaily.hours;

    message.reply(
      `${
        message.author.name
      }, you've gained ${graphsGained.toLocaleString()} graphs and ${hoursGained.toLocaleString()} hours in the past day.`
    );
  },
} satisfies Command;
