import { Masterchat, stringify } from "masterchat";
import { env } from "../utils/env";
import { commandHandler, type Message } from "./command-handler";

export async function startYouTube() {
  console.log("Starting YouTube bot...");

  const mc = await Masterchat.init(env.STREAM_ID, {
    credentials: env.BOT_CREDENTIALS,
  });

  mc.on("chat", (chat) => {
    const message: Message = {
      content: stringify(chat.message!),
      reply: (content: string) => mc.sendMessage(content),
    };
    return commandHandler.handle(message);
  });

  await mc.listen();
}
