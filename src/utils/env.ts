import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    STREAM_ID: z.string(),
  },
  clientPrefix: undefined,
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
