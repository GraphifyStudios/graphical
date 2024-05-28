import "./utils/env";

import { startYouTube } from "./youtube";
import { startApi } from "./api";
import { startCrons } from "./crons";

startYouTube();
startApi();
startCrons();

process.on("unhandledRejection", (err) => console.error(err));
process.on("uncaughtException", (err) => console.error(err));
