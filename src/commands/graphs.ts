import { ensureUser } from "@/utils/db";
import type { Command } from "@/command-handler";

export default {
  name: "graphs",
  aliases: ["points", "xp"],
  description: "View the number of graphs you have",
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    message.reply(
      `${
        message.author.name
      }, you currently have ${user.graphs.toLocaleString()} graph${
        user.graphs !== 1 ? "s" : ""
      }.`
    );
  },
} satisfies Command;
