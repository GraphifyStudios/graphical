import { readdir } from "node:fs/promises";
import { addCooldown, ensureUser, getCooldown } from "./utils/db";
import ms from "ms";

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

    ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
    });

    if (command.cooldown) {
      const cooldown = getCooldown(message.author.id, commandName);
      if (cooldown && Date.now() - cooldown.time < command.cooldown) {
        message.reply(
          `${message.author.name}, you're on cooldown! Please wait ${ms(
            command.cooldown - (Date.now() - cooldown.time),
            { long: true }
          )} before using this command again.`
        );
        return true;
      }

      addCooldown(message.author.id, commandName);
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
