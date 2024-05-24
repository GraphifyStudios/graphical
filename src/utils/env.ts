import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    STREAM_ID: z.string(),
    BOT_CHANNEL_ID: z.string(),
    BOT_CREDENTIALS: z.string(),
    PORT: z.coerce.number().default(3000),
  },
  clientPrefix: undefined,
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
