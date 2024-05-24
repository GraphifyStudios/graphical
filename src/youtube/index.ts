import { Masterchat, stringify } from "masterchat";
import { env } from "../utils/env";
import { commandHandler, type Message } from "./command-handler";
import { addGraphs } from "../utils/db";
import { startLatestVideos } from "./latest-videos";

const activeUsers = new Map<
  string,
  {
    lastMessageTime: number;
    messages: number;
    isMember: boolean;
  }
>();

export async function startYouTube() {
  console.log("Starting YouTube bot...");

  const mc = await Masterchat.init(env.STREAM_ID, {
    credentials: env.BOT_CREDENTIALS,
  });

  const graphDuration = 1 * 60 * 1000;
  setInterval(() => {
    if (activeUsers.size === 0) return;

    for (const [userId, data] of activeUsers) {
      if (Date.now() - data.lastMessageTime > graphDuration)
        activeUsers.delete(userId);

      addGraphs(userId, data.messages * (data.isMember ? 2 : 1));
      activeUsers.set(userId, {
        ...data,
        messages: 0,
      });
    }

    if (activeUsers.size > 0)
      mc.sendMessage(
        `${activeUsers.size} user${activeUsers.size !== 1 ? "s" : ""} ${
          activeUsers.size !== 1 ? "have" : "has"
        } been given graphs!`
      );
  }, graphDuration);

  mc.on("chat", async (chat) => {
    const message: Message = {
      content: stringify(chat.message!),
      author: {
        id: chat.authorChannelId,
        name: chat.authorName!,
        avatar: chat.authorPhoto,
      },
      reply: (content: string) => mc.sendMessage(content),
    };

    if (
      message.author.id === env.BOT_CHANNEL_ID ||
      !message.content.startsWith("!")
    )
      return;

    activeUsers.set(message.author.id, {
      lastMessageTime: Date.now(),
      messages: activeUsers.get(message.author.id)?.messages ?? 0 + 1,
      isMember: !!chat.membership,
    });

    const isBotCommand = await commandHandler.handle(message);
    if (!isBotCommand) {
      const voteCommand = commandHandler.getCommand("vote");
      if (!voteCommand) return;

      const [votee] = message.content.slice("!".length).trim().split(" ");

      voteCommand.run({
        message,
        args: [votee],
      });
    }
  });

  startLatestVideos((content) => mc.sendMessage(content));

  console.log("YouTube bot started!");

  await mc.listen({ ignoreFirstResponse: true });
}
