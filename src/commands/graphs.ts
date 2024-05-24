import { getUser } from "@/utils/db";
import type { Command } from "@/command-handler";

export default {
  name: "graphs",
  aliases: ["points", "xp"],
  description: "View the number of graphs you have",
  run: ({ message }) => {
    const user = getUser(message.author.id);
    message.reply(
      `${message.author.name}, you currently have ${user.graphs} graphs.`
    );
  },
} satisfies Command;
