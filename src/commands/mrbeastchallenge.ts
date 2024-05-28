import type { Command } from "@/command-handler";
import { random } from "@/utils/functions";

const challenges = [
  "Jimmy made you protect a yacht",
  "Jimmy made you protect a lamborghini",
  "Jimmy made you protect a house",
  "Jimmy made you go through an escape room",
  "Jimmy made you not eat food for 30 days",
  "Jimmy buried you alive for a week",
  "Jimmy buried you alive for 50 hours",
  "Jimmy brought you to a deserted island and kept you there for a week",
  "Jimmy brought the miltary to hunt you down",
  "Jimmy brought you to Squid Game",
  "Jimmy trapped you in a room for 100 days",
  "Jimmy put you in solitary confinement for 7 days",
];
const amounts = [
  500, 1000, 5000, 10000, 50000, 100000, 250000, 456000, 800_000, 1_000_000,
];

export default {
  name: "mrbeastchallenge",
  description: "Join a MrBeast challenge",
  cooldown: 30 * 60 * 1000,
  run: ({ message }) => {
    const successful = Math.random() < 0.25;
    const challenge = challenges[random(0, challenges.length)];

    switch (successful) {
      case true:
        {
          const amount = amounts[random(0, amounts.length)];
          message.reply(
            `${message.author.name}, ${challenge}, and you won and recieved ${amount} graphs!`,
          );
        }
        break;
      case false: {
        message.reply(
          `${message.author.name}, ${challenge}, but you lost and returned home with nothing.`,
        );
      }
    }
  },
} satisfies Command;
