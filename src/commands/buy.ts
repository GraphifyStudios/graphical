import type { Command } from "@/command-handler";
import { ensureUser, hasStream, setStream, setUser } from "@/utils/db";

export default {
  name: "buy",
  description: "Buy an item with your graphs",
  usage: "!buy <item>",
  run: ({ message, args }) => {
    const item = args[0];
    if (!item)
      return message.reply(
        `${message.author.name}, please specify an item to buy`,
      );

    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });

    switch (item) {
      case "stream":
        {
          if (user.graphs < 100)
            return message.reply(
              `${message.author.name}, you need at least 100 graphs to buy a stream shoutout.`,
            );
          if (hasStream())
            return message.reply(
              `${message.author.name}, someone is stil being featured in the stream.`,
            );

          setStream({
            id: message.author.id,
            name: message.author.name,
            avatar: message.author.avatar,
          });
          user.graphs -= 100;
          setUser(message.author.id, user);

          message.reply(
            `${message.author.name}, you are now being featured in the stream!`,
          );
        }
        break;
      case "padlock":
        {
          if (user.graphs < 5_000)
            return message.reply(
              `${message.author.name}, you need at least 5,000 graphs to buy a padlock.`,
            );
          if (user.items.includes("padlock"))
            return message.reply(
              `${message.author.name}, you already have a padlock.`,
            );

          user.items.push("padlock");
          user.graphs -= 5_000;
          setUser(message.author.id, user);

          message.reply(`${message.author.name}, you have bought a padlock!`);
        }
        break;
      default:
        return message.reply(
          `${message.author.name}, there is no item named ${item}.`,
        );
    }
  },
} satisfies Command;
