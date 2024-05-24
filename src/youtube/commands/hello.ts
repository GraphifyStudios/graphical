import { getUser } from "../../utils/db";
import type { Command } from "../command-handler";

export default {
  name: "hello",
  run: ({ message }) => {
    const user = getUser(message.author.id);
    console.log(user)
    message.reply(`hello ${message.author.name}`);
  },
} satisfies Command;
