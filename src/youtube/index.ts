import { Masterchat, stringify, type AddChatItemAction } from "masterchat";
import { env } from "@/utils/env";
import { commandHandler, type Message } from "@/command-handler";
import { addGraphs, ensureUser, isNewUser, setUser } from "@/utils/db";
import { startLatestVideos } from "./latest-videos";
import ms from "ms";

const activeUsers = new Map<
  string,
  {
    lastMessageTime: number;
    messages: number;
    isMember: boolean;
  }
>();

function sendMessage(mc: Masterchat, content: string) {
  if (content.length === 0) return;
  if (content.length > 200) {
    const messages = [];
    while (content.length > 200) {
      messages.push(content.substring(0, 200));
      content = content.substring(200);
    }
    for (const message of messages) {
      mc.sendMessage(message);
    }
  } else mc.sendMessage(content);
}

class YTMessage implements Message {
  constructor(private chat: AddChatItemAction, private mc: Masterchat) {}

  get channel() {
    return {
      id: this.chat.authorChannelId,
      platform: "youtube",
    } as const;
  }

  get author() {
    return {
      id: this.chat.authorChannelId,
      name: this.chat.authorName!,
      avatar: this.chat.authorPhoto,
    };
  }

  get content() {
    return stringify(this.chat.message!);
  }

  reply(content: string) {
    sendMessage(this.mc, content);
  }
}

async function startBot(streamId: string) {
  const mc = await Masterchat.init(streamId, {
    credentials: env.YOUTUBE_BOT_CREDENTIALS,
  });

  mc.on("chat", async (chat) => {
    const message = new YTMessage(chat, mc);
    if (message.author.id === env.YOUTUBE_BOT_CHANNEL_ID) return;

    if (isNewUser(message.author.id))
      message.reply(`Welcome to the stream ${message.author.name}!`);

    activeUsers.set(message.author.id, {
      lastMessageTime: Date.now(),
      messages: (activeUsers.get(message.author.id)?.messages ?? 0) + 1,
      isMember: !!chat.membership,
    });

    const user = ensureUser(message.author.id, {
      id: message.author.id,
      name: message.author.name,
    });

    const inactiveTime = 7 * 24 * 60 * 60 * 1000;
    if (
      user.lastMessageTime &&
      Date.now() - user.lastMessageTime > inactiveTime
    )
      message.reply(
        `Welcome back ${message.author.name}! You haven't chatted in ${ms(
          Date.now() - user.lastMessageTime,
          { long: true }
        )}.`
      );

    user.messages++;
    user.lastMessageTime = Date.now();
    setUser(message.author.id, user);

    if (message.content.startsWith("!")) {
      const isBotCommand = await commandHandler.handle(message);
      if (!isBotCommand) {
        const helloCommands = ["hello", "hi", "hey", "sup", "yo"];
        if (helloCommands.includes(message.content.toLowerCase()))
          return message.reply(`Hello ${message.author.name}!`);

        const goodbyeCommands = [
          "bye",
          "bye bye",
          "goodbye",
          "see you later",
          "see you",
          "cya",
          "gtg",
        ];
        if (goodbyeCommands.includes(message.content.toLowerCase()))
          return message.reply(`Goodbye ${message.author.name}!`);

        const voteCommand = commandHandler.getCommand("vote");
        if (!voteCommand) return;

        const [votee] = message.content.slice("!".length).trim().split(" ");
        return voteCommand.run({
          message,
          args: [votee],
        });
      }
    }
  });

  startLatestVideos((content) => sendMessage(mc, content));

  console.log(`YouTube bot started for stream ID: ${streamId}!`);

  mc.listen({ ignoreFirstResponse: true });
  return [mc, streamId] as const;
}

async function getStreams(): Promise<string[]> {
  const url = `https://www.youtube.com/channel/${env.YOUTUBE_STREAMER_CHANNEL_ID}/streams`;
  const res = await fetch(url);
  const html = await res.text();
  const initialData = JSON.parse(
    "{" + html.split("var ytInitialData = {")[1].split("};")[0] + "}"
  );
  const streams = initialData.contents.twoColumnBrowseResultsRenderer.tabs
    .find((tab: any) => tab.tabRenderer.title === "Live")
    ?.tabRenderer.content.richGridRenderer.contents.filter(
      (stream: any) => !stream.richItemRenderer.content.videoRenderer.lengthText
    )
    .map(
      (stream: any) => stream.richItemRenderer.content.videoRenderer.videoId
    );
  return streams;
}

export async function startYouTube() {
  console.log("Starting YouTube bot...");

  const streamsListening: Awaited<ReturnType<typeof startBot>>[] = [];

  const streamIds = await getStreams();
  for (const streamId of streamIds) {
    streamsListening.push(await startBot(streamId));
  }

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

    if (activeUsers.size > 0) {
      for (const [mc] of streamsListening) {
        sendMessage(
          mc,
          `${activeUsers.size} user${activeUsers.size !== 1 ? "s" : ""} ${
            activeUsers.size !== 1 ? "have" : "has"
          } been given graphs!`
        );
      }
    }
  }, graphDuration);

  setInterval(async () => {
    const newStreamIds = await getStreams();
    const streamsToRemove = streamsListening
      .filter(([, streamId]) => !newStreamIds.includes(streamId))
      .map(([mc]) => mc);
    await Promise.all(streamsToRemove.map((mc) => mc.stop()));

    const newStreams = newStreamIds.filter(
      (streamId) => !streamsListening.some(([, id]) => id === streamId)
    );
    for (const streamId of newStreams) {
      streamsListening.push(await startBot(streamId));
    }
  }, 5 * 60 * 1000);
}
