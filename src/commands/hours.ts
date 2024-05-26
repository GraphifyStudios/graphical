import type { Command } from "@/command-handler";
import { ensureUser } from "@/utils/db";
import { round } from "@/utils/functions";

export default {
  name: "hours",
  description: "View the number of hours you have",
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
    });
    const hours = round(user.graphs / 12, 2);

    message.reply(
      `${
        message.author.name
      }, you currently have ${hours.toLocaleString()} hour${
        hours !== 1 ? "s" : ""
      }.`
    );
  },
} satisfies Command;
