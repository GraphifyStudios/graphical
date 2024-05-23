import "./utils/env";

import { env } from "./utils/env";
import { Masterchat } from "masterchat";

const mc = await Masterchat.init(env.STREAM_ID, {
  credentials: env.BOT_CREDENTIALS,
});

mc.on("chat", (message) => {
  console.log(message);
});

await mc.listen();
