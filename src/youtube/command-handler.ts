import { readdir } from "node:fs/promises";

export interface Message {
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
  const commandFiles = await readdir("./src/youtube/commands");
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    commands.push(command.default);
  }

  return commands;
}

export const commands = await loadCommands();
export const commandHandler = new CommandHandler(commands);
