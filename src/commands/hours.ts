import type { Command } from "@/command-handler";
import { getUser } from "@/utils/db";

export default {
  name: "hours",
  description: "View the number of hours you have",
  run: ({ message }) => {
    const user = getUser(message.author.id);
    const hours = Math.floor(user.graphs / 12);

    message.reply(
      `${message.author.name}, you have ${hours.toLocaleString()} hour${
        hours !== 1 ? "s" : ""
      }`
    );
  },
} as Command;
