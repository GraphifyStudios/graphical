import { Masterchat } from "masterchat";
import { env } from "../utils/env";

export async function startYouTube() {
  console.log("Starting YouTube bot...");

  const mc = await Masterchat.init(env.STREAM_ID, {
    credentials: env.BOT_CREDENTIALS,
  });

  mc.on("chat", (message) => {
    console.log(message);
  });

  await mc.listen();
}
