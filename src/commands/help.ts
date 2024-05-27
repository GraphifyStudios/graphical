import type { Command } from "@/command-handler";
import { env } from "@/utils/env";

export default {
  name: "help",
  aliases: ["commands", "graphical", "bot"],
  description: "Get information about Graphical",
  run: ({ message }) =>
    message.reply(
      `Hey there, I'm Graphical! You can view my commands at ${env.FRONTEND_URL}/commands.`,
    ),
} satisfies Command;
