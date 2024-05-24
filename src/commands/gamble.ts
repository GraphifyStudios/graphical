import { getUser, setGraphs } from "@/utils/db";
import type { Command } from "@/command-handler";

export default {
  name: "gamble",
  description: "Play a game of chance",
  cooldown: 1 * 60 * 1000,
  run: ({ message, args }) => {
    if (!args[0])
      return message.reply(
        `${message.author.name}, you need to specify the number of graphs to gamble.`
      );

    const amount = parseInt(args[0]);
    if (isNaN(amount))
      return message.reply(`${message.author.name}, that's not a number.`);
    if (amount < 50)
      return message.reply(
        `${message.author.name}, you need to bet more than 50 graphs.`
      );

    const user = getUser(message.author.id);
    if (amount > user.graphs)
      return message.reply(
        `${
          message.author.name
        }, you don't have enough graphs to gamble ${amount.toLocaleString()}.`
      );

    const won = Math.random() < 0.5;
    switch (won) {
      case true:
        {
          const amountWon = Number(
            (amount * (Math.random() * 0.55)).toFixed(0)
          );

          user.graphs += amountWon;
          setGraphs(message.author.id, user.graphs);

          message.reply(
            `${
              message.author.name
            }, you won ${amountWon.toLocaleString()} graphs! You now have ${user.graphs.toLocaleString()} graphs.`
          );
        }
        break;
      case false:
        {
          user.graphs -= amount;
          setGraphs(message.author.id, user.graphs);
          message.reply(
            `${
              message.author.name
            }, you lost ${amount.toLocaleString()} graphs. You now have ${user.graphs.toLocaleString()} graphs.`
          );
        }
        break;
    }
  },
} as Command;
