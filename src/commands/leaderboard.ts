import type { Command } from "@/command-handler";
import { getUsers } from "@/utils/db";

export default {
  name: "leaderboard",
  description: "View the top 10 users with the most graphs",
  run: ({ message }) => {
    const users = getUsers();
    const topUsers = users.sort((a, b) => b.graphs - a.graphs).slice(0, 10);

    message.reply(
      `Graphs leaderboard: ${topUsers
        .map(
          (user, index) =>
            `${index + 1}. ${user.name} (${user.graphs.toLocaleString()})`
        )
        .join(", ")}`
    );
  },
} satisfies Command;
