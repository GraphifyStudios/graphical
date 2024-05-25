import { addVote, getVote } from "@/utils/db";
import type { Command } from "@/command-handler";

const names = {
  tseries: "T-Series",
  mrbeast: "MrBeast",
  pewdiepie: "PewDiePie",
} as const;

export default {
  name: "vote",
  description: "Vote for someone",
  run: ({ message, args }) => {
    const votee = args[0]?.toLowerCase();
    if (!votee)
      return message.reply(
        `${message.author.name}, please specify someone to vote for.`
      );

    addVote(votee);

    // this will always exist because of the check in `addVote`
    const { votes } = getVote(votee)!;
    message.reply(
      `${message.author.name} has voted for ${
        names[votee as keyof typeof names] ?? votee
      }${
        votes > 1 ? `, and so has ${votes.toLocaleString()} other people` : ""
      }!`
    );
  },
} satisfies Command;
