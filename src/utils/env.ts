import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    YOUTUBE_STREAMER_CHANNEL_ID: z.string(),
    YOUTUBE_BOT_CHANNEL_ID: z.string(),
    YOUTUBE_BOT_CREDENTIALS: z.string(),
    PORT: z.coerce.number().default(3000),
    FRONTEND_URL: z.string().default("http://localhost:3000"),
  },
  clientPrefix: undefined,
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
