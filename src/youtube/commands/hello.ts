import type { Command } from "../command-handler";

export default {
  name: "hello",
  run: ({ message }) => {
    message.reply(
      "hello world (ignore this, toastedtoast is working on a new bot)"
    );
  },
} satisfies Command;
