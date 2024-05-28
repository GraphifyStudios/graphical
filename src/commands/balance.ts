import { ensureUser } from "@/utils/db";
import type { Command } from "@/command-handler";

export default {
  name: "balance",
  aliases: ["bal", "graphs", "points", "xp"],
  description: "View your current balance",
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    message.reply(
      `${message.author.name}, you currently have ${user.graphs.toLocaleString()} graph${user.graphs !== 1 ? "s" : ""
      } in your wallet and ${user.bank.toLocaleString()} in your bank.`,
    );
  },
} satisfies Command;
