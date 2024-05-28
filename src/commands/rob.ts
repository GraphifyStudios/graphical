import type { Command } from "@/command-handler";
import { ensureUser, getUser, getUsers, setUser } from "@/utils/db";
import { random, round } from "@/utils/functions";

export default {
  name: "rob",
  aliases: ["steal"],
  description: "Rob graphs from a user's wallet",
  usage: "!rob <user>",
  cooldown: 30 * 60 * 1000,
  run: ({ message, args }) => {
    if (!args[0])
      return message.reply(
        `${message.author.name}, please specify a user to rob.`,
      );

    const author = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });

    const arg = args.join(" ");
    let user = getUser(arg);
    if (!user) {
      let query = arg.toLowerCase();
      if (query.startsWith("@") || query.startsWith("+"))
        query = query.split("@")[1];
      user =
        getUsers().find((c) => c.name.toLowerCase().includes(query)) ?? null;
    }
    if (!user)
      return message.reply(
        `${message.author.name}, no user found. Please specify the name or ID of the user to rob.`,
      );
    if (user.id === message.author.id)
      return message.reply(`${message.author.name}, you can't rob yourself.`);
    if (author.graphs < user.graphs)
      return message.reply(
        `${message.author.name}, you don't have enough graphs to rob ${user.name}.`,
      );
    if (user.graphs <= 0)
      return message.reply(
        `${message.author.name}, the user you're trying to rob has no graphs.`,
      );

    const successful = Math.random() < 0.5;

    switch (successful) {
      case true:
        {
          const amount = random(1, round(user.graphs / 5));
          user.graphs -= amount;
          author.graphs += amount;
          setUser(message.author.id, author);
          setUser(user.id, user);

          message.reply(
            `${message.author.name}, you stole ${amount.toLocaleString()} graphs from ${user.name}'s wallet.`,
          );
        }
        break;
      case false:
        {
          const amount = random(1, round(user.graphs / 15));
          user.graphs += amount;
          author.graphs -= amount;
          setUser(message.author.id, author);
          setUser(user.id, user);

          message.reply(
            `${message.author.name}, you tried to steal from ${user.name}'s wallet but got caught and had to pay back ${amount.toLocaleString()} graphs.`,
          );
        }
        break;
    }
  },
} satisfies Command;
