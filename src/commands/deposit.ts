import type { Command } from "@/command-handler";
import { ensureUser, setUser } from "@/utils/db";
import { unabbreviate } from "@/utils/functions";

export default {
  name: "deposit",
  aliases: ["dep"],
  description: "Deposit money into your bank",
  usage: "!deposit <amount>",
  run: ({ message, args }) => {
    if (!args[0])
      return message.reply(
        `${message.author.name}, please specify an amount of graphs to deposit.`,
      );

    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    const amount = unabbreviate(args[0], user.graphs);
    if (isNaN(amount) || amount < 0)
      return message.reply(
        `${message.author.name}, please specify a valid amount of graphs to deposit.`,
      );
    if (amount > user.graphs || user.graphs === 0)
      return message.reply(
        `${message.author.name}, you don't have enough graphs to deposit.`,
      );

    user.graphs -= amount;
    user.bank += amount;
    setUser(message.author.id, user);

    message.reply(
      `${message.author.name}, you deposited ${amount.toLocaleString()} graphs into your bank. You now have ${user.graphs.toLocaleString()} graphs in your wallet and ${user.bank.toLocaleString()} in your bank.`,
    );
  },
} satisfies Command;
