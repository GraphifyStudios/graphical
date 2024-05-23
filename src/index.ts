import { Masterchat } from "masterchat";

const mc = await Masterchat.init(process.env.STREAM_ID!);

mc.on("chat", (message) => {
  console.log(message);
});

await mc.listen();
