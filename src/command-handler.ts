import { readdir } from "node:fs/promises";

export interface Message {
  channel: {
    id: string;
    platform: "youtube";
  };
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  reply: (content: string) => void;
}

export interface Command {
  name: string;
  aliases?: string[];
  description?: string;
  cooldown?: number;
  run: ({ message, args }: { message: Message; args: string[] }) => any;
}

class CommandHandler {
  private commands: Map<string, Command>;
  private cooldowns = new Map<string, number>();

  constructor(commands: Command[]) {
    this.commands = new Map(commands.map((command) => [command.name, command]));
  }

  getCommand(name: string) {
    return (
      this.commands.get(name.toLowerCase()) ??
      [...this.commands.values()].find((command) =>
        command.aliases?.includes(name.toLowerCase())
      )
    );
  }

  async handle(message: Message) {
    const [commandName, ...args] = message.content
      .slice("!".length)
      .trim()
      .split(" ");
    const command = this.getCommand(commandName);
    if (!command) return false;

    if (command.cooldown) {
      const cooldown = this.cooldowns.get(
        `${commandName}-${message.author.id}`
      );
      if (cooldown) {
        if (Date.now() - cooldown < command.cooldown)
          return message.reply(
            `${
              message.author.name
            }, you're on cooldown! Please wait ${Math.round(
              (command.cooldown - (Date.now() - cooldown)) / 1000
            )} seconds before using this command again.`
          );
      }

      this.cooldowns.set(`${commandName}-${message.author.id}`, Date.now());
    }

    try {
      await command.run({ message, args });
      return true;
    } catch (err) {
      console.error(err);
    }
  }
}

async function loadCommands() {
  const commands: Command[] = [];
  const commandFiles = await readdir("./src/commands");
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.default);
  }

  return commands;
}

export const commands = await loadCommands();
export const commandHandler = new CommandHandler(commands);
