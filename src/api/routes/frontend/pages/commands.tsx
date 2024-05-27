import { Hono } from "hono";
import { commands as allCommands } from "@/command-handler";

export const commands = new Hono().get("/", (c) => {
  return c.render(
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-3">
      <h1 class="text-center text-3xl font-bold tracking-tighter">Commands</h1>
      {[...allCommands]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((command) => (
          <div class="flex flex-col gap-2 rounded-lg bg-blue-900/50 p-4">
            <h1 class="text-xl">
              <pre class="w-fit rounded-lg bg-neutral-900 p-1">
                !{command.name}
              </pre>
            </h1>
            <div>
              <p>{command.description}</p>
              {!!command.aliases?.length && (
                <p>
                  <strong>Aliases</strong>: {command.aliases?.join(", ")}
                </p>
              )}
              {!!command.usage && (
                <p>
                  <strong>Usage</strong>: {command.usage}
                </p>
              )}
            </div>
          </div>
        ))}
    </div>,
  );
});
