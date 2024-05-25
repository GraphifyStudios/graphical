import type { Command } from "@/command-handler";
import { getCount } from "@/utils/db";

export default {
  name: "counting",
  description: "View the current counting number",
  run: ({ message }) => {
    const count = getCount();
    message.reply(`${message.author.name}, the current count is ${count}.`);
  },
} satisfies Command;
