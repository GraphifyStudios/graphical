import type { Command } from "../command-handler";

export default {
  name: "hello",
  run: ({ message }) => {
    message.reply(`hello ${message.author.name}`);
  },
} satisfies Command;
