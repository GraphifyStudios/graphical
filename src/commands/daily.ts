import type { Command } from "@/command-handler";
import { dailyReward } from "@/consts";
import { ensureUser, setUser } from "@/utils/db";

export default {
  name: "daily",
  description: "Get your daily graphs",
  cooldown: 24 * 60 * 60 * 1000,
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
    });
    user.graphs += dailyReward;
    setUser(message.author.id, user);

    message.reply(
      `${
        message.author.name
      }, you have recieved ${dailyReward.toLocaleString()} graphs!`
    );
  },
} satisfies Command;
