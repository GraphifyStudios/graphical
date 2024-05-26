import type { Command } from "@/command-handler";
import { ensureUser, setUser } from "@/utils/db";
import { random } from "@/utils/functions";

const places = [
  "the Graphify server room",
  "Graphify's house",
  "ToastedToast's office",
  "MrBeast's studio",
  "MrBeast's house",
  "the sewers",
  "the closet",
  "some random place in the middle of nowhere",
  "a random alleyway",
  "a random street",
  "your house",
  "your pockets",
  "your parents' basement",
];

export default {
  name: "search",
  description: "Search for graphs",
  cooldown: 5 * 60 * 1000,
  run: ({ message }) => {
    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
    });
    const successful = Math.random() < 0.5;
    const randomPlace = places[random(0, places.length - 1)];

    switch (successful) {
      case true:
        {
          const amount = random(500, 1_000);
          user.graphs += amount;
          setUser(message.author.id, user);

          message.reply(
            `${
              message.author.name
            }, you searched in ${randomPlace} and found ${amount.toLocaleString()} graphs!`
          );
        }
        break;
      case false:
        message.reply(
          `${message.author.name}, you searched in ${randomPlace} and found nothing.`
        );
        break;
    }
  },
} satisfies Command;
