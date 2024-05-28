import type { Command } from "@/command-handler";
import { getGraphs, getUsers } from "@/utils/db";

export default {
  name: "leaderboard",
  description: "View the top 10 users with the most graphs",
  run: ({ message }) => {
    const users = getUsers();
    const topUsers = users
      .sort((a, b) => getGraphs(b) - getGraphs(a))
      .slice(0, 10);

    message.reply(
      `Graphs leaderboard: ${topUsers
        .map(
          (user, index) =>
            `${index + 1}. ${user.name} (${getGraphs(user).toLocaleString()})`,
        )
        .join(", ")}`,
    );
  },
} satisfies Command;
