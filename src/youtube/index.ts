import { Masterchat, stringify } from "masterchat";
import { env } from "../utils/env";
import { commandHandler, type Message } from "./command-handler";
import { addGraphs } from "../utils/db";

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

  const graphDuration = 5 * 60 * 1000;
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

  mc.on("chat", (chat) => {
    if (chat.authorChannelId === env.BOT_CHANNEL_ID) return;

    const message: Message = {
      content: stringify(chat.message!),
      author: {
        id: chat.authorChannelId,
        name: chat.authorName!,
        avatar: chat.authorPhoto,
      },
      reply: (content: string) => mc.sendMessage(content),
    };

    activeUsers.set(message.author.id, {
      lastMessageTime: Date.now(),
      messages: activeUsers.get(message.author.id)?.messages ?? 0 + 1,
      isMember: !!chat.membership,
    });

    return commandHandler.handle(message);
  });

  console.log("YouTube bot started!");

  await mc.listen({ ignoreFirstResponse: true });
}
