import { getUsers } from "@/utils/db";
import { round } from "@/utils/functions";
import { Hono } from "hono";

export const leaderboard = new Hono().get("/", (c) => {
  const users = getUsers();
  return c.render(
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
      <h1 class="text-center text-3xl font-bold tracking-tighter">
        Leaderboard
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
                <td class="p-2 flex items-center gap-2">
                  <img src={user.avatar} alt={user.name} width={32} height={32} />
                  <p>{user.name}</p>
                </td>
                <td class="p-2 text-center">{user.graphs.toLocaleString()}</td>
                <td class="p-2 text-center">
                  {round(user.graphs / 12, 2).toLocaleString()}
                </td>
                <td class="p-2 text-center">{user.messages.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,
  );
});
