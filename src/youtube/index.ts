import { Masterchat, stringify } from "masterchat";
import { env } from "@/utils/env";
import { commandHandler, type Message } from "@/command-handler";
import { addGraphs } from "@/utils/db";
import { startLatestVideos } from "./latest-videos";

const activeUsers = new Map<
  string,
  {
    lastMessageTime: number;
    messages: number;
    isMember: boolean;
  }
>();

async function startBot(streamId: string) {
  const mc = await Masterchat.init(streamId, {
    credentials: env.YOUTUBE_BOT_CREDENTIALS,
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
      channel: {
        id: streamId,
        platform: "youtube",
      },
      content: stringify(chat.message!),
      author: {
        id: chat.authorChannelId,
        name: chat.authorName!,
        avatar: chat.authorPhoto,
      },
      reply: (content: string) => mc.sendMessage(content),
    };

    if (
      message.author.id === env.YOUTUBE_BOT_CHANNEL_ID ||
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
