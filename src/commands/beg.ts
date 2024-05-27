import type { Command } from "@/command-handler";
import { ensureUser, setUser } from "@/utils/db";
import { random } from "@/utils/functions";

const characters = [
  "MrBeast",
  "T-Series",
  "PewDiePie",
  "Mark Rober",
  "Graphify",
  "ToastedToast",
  "GNZGUY",
  "JipStats",
  "Charlie Ashford",
  "Hexagon",
  "RedFireNiceBoi",
  "Nia",
  "Galvin",
  "IfyStats", // very controversial
  "YAB ?!",
  "AJ",
];

export default {
  name: "beg",
  description: "Beg for graphs",
  cooldown: 30 * 1000,
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
      avatar: message.author.avatar,
    });

    const successful = Math.random() < 0.5;
    const amount = random(1, 500);
    const randomCharacter = characters[random(0, characters.length - 1)];

    if (user.graphs - amount < 0)
      return message.reply(
        `${message.author.name}, you don't have enough graphs to beg.`
      );

    switch (successful) {
      case true:
        {
          user.graphs += amount;
          setUser(message.author.id, user);

          message.reply(
            `${message.author.name}, you begged to ${randomCharacter} and they gave you ${amount} graphs!`
          );
        }
        break;
      case false:
        {
          user.graphs -= amount;
          setUser(message.author.id, user);

          message.reply(
            `${message.author.name}, you begged to ${randomCharacter} and they took ${amount} graphs from you.`
          );
        }
        break;
    }
  },
} satisfies Command;
