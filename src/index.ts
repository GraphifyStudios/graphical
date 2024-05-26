import "./utils/env";

import { startYouTube } from "./youtube";
import { startApi } from "./api";
import { startCrons } from "./crons";

startYouTube();
startApi();
startCrons();
