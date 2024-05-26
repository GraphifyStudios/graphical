import type { Command } from "@/command-handler";
import { ensureUser, setUser } from "@/utils/db";
import { random } from "@/utils/functions";

export default {
  name: "analyze",
  description: "Analyze some statistics and get graphs as a reward",
  cooldown: 30 * 60 * 1000,
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
    });
    const successful = Math.random() < 0.5;

    switch (successful) {
      case true:
        {
          const reward = random(1_000, 5_000);
          user.graphs += reward;
          setUser(message.author.id, user);

          message.reply(
            `${
              message.author.name
            }, you analyzed some statistics and got ${reward.toLocaleString()} graphs!`
          );
        }
        break;
      case false:
        message.reply(
          `${message.author.name}, you analyzed statisics but your boss decided to pay you in exposure.`
        );
        break;
    }
  },
} satisfies Command;
