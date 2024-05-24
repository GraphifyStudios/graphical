import { Masterchat, stringify } from "masterchat";
import { env } from "../utils/env";
import { commandHandler, type Message } from "./command-handler";

export async function startYouTube() {
  console.log("Starting YouTube bot...");

  const mc = await Masterchat.init(env.STREAM_ID, {
    credentials: env.BOT_CREDENTIALS,
  });

  mc.on("chat", (chat) => {
    if(chat.authorChannelId === env.BOT_CHANNEL_ID) return;

    const message: Message = {
      content: stringify(chat.message!),
      author: {
        id: chat.authorChannelId,
        name: chat.authorName!,
        avatar: chat.authorPhoto,
      },
      reply: (content: string) => mc.sendMessage(content),
    };
    return commandHandler.handle(message);
  });

  console.log("YouTube bot started!");

  await mc.listen({ ignoreFirstResponse: true });
}
