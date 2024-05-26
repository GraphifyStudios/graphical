import type { Command } from "@/command-handler";
import { droppedReward } from "@/consts";
import { ensureUser, isDropped, toggleDropped } from "@/utils/db";

export default {
  name: "pickup",
  description: "Pick up dropped graphs",
  run: ({ message }) => {
    if (!isDropped())
      return message.reply(
        `${message.author.name}, no graphs have been dropped yet!`
      );

    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });
    user.graphs += droppedReward;
    toggleDropped();

    message.reply(
      `${message.author.name}, you have picked up ${droppedReward} graphs!`
    );
  },
} satisfies Command;
