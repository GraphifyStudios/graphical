import {
  getLatestVideos as getLatestVideosFromDb,
  setLatestVideo,
} from "../utils/db";

export async function startLatestVideos(
  sendMessage: (content: string) => void
) {
  function getLatestVideos(channelId: string, channelName: string) {
    const ISO8601Duration = (ISO: any) => {
      const units = {
        Y: 31536000,
        M: 2592000,
        D: 86400,
        H: 3600,
        // @ts-expect-error idk
        M: 60,
        S: 1,
      } as const;

      const unitsKeys = Object.keys(units);
      let newISO = ISO.replace("P", "").replace("T", "");
      let foundedKeys = [];
      let durationISO = [];

      for (let i = 0; i < newISO.length; i++) {
        if (unitsKeys.includes(newISO[i]) == true) {
          foundedKeys.push(newISO[i]);
          newISO = newISO.replace(newISO[i], " ");
        }
      }

      newISO = newISO.split(" ");
      newISO.pop();

      for (let i = 0; i < foundedKeys.length; i++) {
        durationISO[i] =
          Number(newISO[i]) * units[foundedKeys[i] as keyof typeof units];
      }

      let duration = durationISO.reduce((a, b) => a + b, 0);

      return duration;
    };

    try {
      fetch(
        `https://yt.lemnoslife.com/noKey/playlistItems?part=snippet&fields=items/snippet/resourceId/videoId&order=date&maxResults=10&playlistId=${channelId.replace(
          "UC",
          "UU"
        )}`
      )
        .then((res) => res.json())
        .then((videos) => {
          let vidIds = videos.items.map((video: any) => {
            return video.snippet.resourceId.videoId;
          });

          if (vidIds !== null) {
            fetch(
              `https://yt.lemnoslife.com/noKey/videos?part=snippet,liveStreamingDetails,contentDetails&fields=items(id,snippet/title,snippet/publishedAt,liveStreamingDetails,contentDetails/duration)&id=${vidIds.join(
                ","
              )}`
            )
              .then((res) => res.json())
              .then((filteredVideos) => {
                let filteredVids = filteredVideos.items;
                const currentVideo = filteredVids.filter(
                  (filteredVid: any) =>
                    ISO8601Duration(filteredVid.contentDetails.duration) > 60 &&
                    !filteredVid.liveStreamingDetails
                )[0];
                const currentVideoId = currentVideo.id;
                const currentShort = filteredVids.filter(
                  (filteredVid: any) =>
                    ISO8601Duration(filteredVid.contentDetails.duration) <=
                      60 && !filteredVid.liveStreamingDetails
                )[0];
                const currentShortId = currentShort.id;

                const {
                  latestVideoId: lastVideoId,
                  latestShortId: lastShortId,
                } = getLatestVideosFromDb(channelId)!;
                if (lastVideoId !== currentVideoId) {
                  setLatestVideo(channelId, currentVideoId, "video");
                  sendMessage(
                    `${channelName} just uploaded a new video titled "${currentVideo.snippet.title}": https://youtu.be/${currentVideoId}`
                  );
                }
                if (lastShortId !== currentShortId) {
                  setLatestVideo(channelId, currentShortId, "short");
                  sendMessage(
                    `${channelName} just uploaded a new short titled "${currentShort.snippet.title}": https://youtube.com/shorts/${currentShortId}`
                  );
                }
              });
          }
        });
    } catch (err) {
      console.error(err);
    }
  }

  getLatestVideos("UCX6OQ3DkcsbYNE6H8uQQuVA", "MrBeast");
  getLatestVideos("UCgG5aRcYGzPPB4UG3mS-ZNg", "Graphify");
  setInterval(
    () => getLatestVideos("UCX6OQ3DkcsbYNE6H8uQQuVA", "MrBeast"),
    4000
  );
  setInterval(
    () => getLatestVideos("UCgG5aRcYGzPPB4UG3mS-ZNg", "Graphify"),
    30000
  );
}
