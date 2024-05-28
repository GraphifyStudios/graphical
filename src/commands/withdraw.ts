import type { Command } from "@/command-handler";
import { ensureUser, setUser } from "@/utils/db";
import { unabbreviate } from "@/utils/functions";

export default {
  name: "withdraw",
  description: "Withdraw from your bank account",
  run: ({ message, args }) => {
    if (!args[0])
      return message.reply(
        `${message.author.name}, please specify an amount of graphs to withdraw.`,
      );

    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    const amount = unabbreviate(args[0], user.bank);
    if (isNaN(amount) || amount < 0)
      return message.reply(
        `${message.author.name}, please specify a valid amount of graphs to withdraw.`,
      );
    if (amount > user.bank)
      return message.reply(
        `${message.author.name}, you don't have enough graphs in your bank to withdraw.`,
      );

    user.graphs += amount;
    user.bank -= amount;
    setUser(message.author.id, user);

    message.reply(
      `${message.author.name}, you withdrew ${amount.toLocaleString()} graphs from your bank. You now have ${user.graphs.toLocaleString()} graphs in your wallet and ${user.bank.toLocaleString()} in your bank.`,
    );
  },
} satisfies Command;
