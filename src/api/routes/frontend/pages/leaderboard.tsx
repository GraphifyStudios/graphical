import { getGraphs, getUsers, getVotes } from "@/utils/db";
import { round } from "@/utils/functions";
import { Hono } from "hono";

export const leaderboard = new Hono()
  .get("/users", (c) => {
    const users = getUsers().sort((a, b) => getGraphs(b) - getGraphs(a));
    return c.render(
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h1 class="text-center text-3xl font-bold tracking-tighter">
          User Leaderboard
        </h1>
        <div class="rounded-lg border border-blue-500 bg-blue-950/50">
          <table class="w-full">
            <thead class="[&_tr]:border-b [&_tr]:border-blue-500">
              <tr>
                <th class="p-2">#</th>
                <th class="p-2 text-left">Name</th>
                <th class="p-2">Graphs</th>
                <th class="p-2">Hours</th>
                <th class="p-2">Messages</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              {users.map((user, index) => (
                <tr key={user.id} class="border-b border-blue-500">
                  <td class="p-2 text-center">{index + 1}</td>
                  <td>
                    <a
                      href={`/user/${user.id}`}
                      class="flex items-center gap-2 p-2"
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        class="rounded-sm"
                      />
                      <p>{user.name}</p>
                    </a>
                  </td>
                  <td class="p-2 text-center">
                    {getGraphs(user).toLocaleString()}
                  </td>
                  <td class="p-2 text-center">
                    {round(getGraphs(user) / 12, 2).toLocaleString()}
                  </td>
                  <td class="p-2 text-center">
                    {user.messages.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>,
    );
  })
  .get("/votes", (c) => {
    const votes = getVotes().sort((a, b) => b.votes - a.votes);
    return c.render(
      <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <h1 class="text-center text-3xl font-bold tracking-tighter">
          Votes Leaderboard
        </h1>
        <div class="rounded-lg border border-blue-500 bg-blue-950/50">
          <table class="w-full">
            <thead class="[&_tr]:border-b [&_tr]:border-blue-500">
              <tr>
                <th class="p-2">#</th>
                <th class="p-2 text-left">Name</th>
                <th class="p-2">Votes</th>
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              {votes.map((vote, index) => (
                <tr key={vote.id} class="border-b border-blue-500">
                  <td class="p-2 text-center">{index + 1}</td>
                  <td class="p-2">
                    <p>{vote.id}</p>
                  </td>
                  <td class="p-2 text-center">{vote.votes.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>,
    );
  });
