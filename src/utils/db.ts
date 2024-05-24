import { exists } from "node:fs/promises";
import { join } from "node:path";

interface Database {
  users: {
    id: string;
    graphs: number;
    messages: number;
  }[];
  votes: {
    id: string;
    votes: number;
  }[];
  latestVideos: {
    channelId: string;
    latestVideoId: string;
    latestShortId: string;
  }[];
}

const dbPath = join(process.cwd(), "db.json");

async function initDatabase() {
  if (!(await exists(dbPath))) {
    await Bun.write(
      dbPath,
      JSON.stringify({
        users: [],
        votes: [],
        latestVideos: [
          {
            channelId: "UCX6OQ3DkcsbYNE6H8uQQuVA",
            latestVideoId: "",
            latestShortId: "",
          },
          {
            channelId: "UCgG5aRcYGzPPB4UG3mS-ZNg",
            latestVideoId: "famqxYOP_hQ",
            latestShortId: "gaQ147zVniE",
          },
        ],
      } satisfies Database)
    );
  }
}

await initDatabase();

const dbFile = Bun.file(dbPath);
const db: Database = await dbFile.json();

export function getUsers() {
  return [...db.users];
}

const createUser = (
  id: string,
  data?: Partial<Database["users"][number]>
): Database["users"][number] =>
  Object.assign(data || {}, {
    id,
    graphs: 0,
    messages: 0,
  } satisfies Database["users"][number]);

export function getUser(id: string) {
  const user = db.users.find((c) => c.id === id);
  if (!user) {
    const data = createUser(id);
    db.users.push(data);
    return data;
  }
  return user;
}

export function isNewUser(id: string) {
  const user = db.users.find((c) => c.id === id);
  if (!user) {
    db.users.push(createUser(id));
    return true;
  } else return false;
}

export function setUser(id: string, data: Partial<Database["users"][number]>) {
  const userIndex = db.users.findIndex((c) => c.id === id);
  if (userIndex === -1) {
    db.users.push(createUser(id, data));
    return;
  }
  db.users[userIndex] = Object.assign(db.users[userIndex], data);
}

export function addGraphs(id: string, graphs: number) {
  const user = getUser(id);
  user.graphs += graphs;
  setUser(id, user);
}

export function getVotes() {
  return [...db.votes];
}

export function getVote(id: string) {
  const vote = db.votes.find((c) => c.id === id);
  if (!vote) {
    const data = {
      id,
      votes: 0,
    } satisfies Database["votes"][number];
    db.votes.push(data);
    return data;
  }
  return vote;
}

export function addVote(id: string) {
  const voteIndex = db.votes.findIndex((c) => c.id === id);
  if (voteIndex === -1) {
    db.votes.push({
      id,
      votes: 1,
    });
    return;
  }
  db.votes[voteIndex].votes += 1;
}

export function getLatestVideos(channelId: string) {
  const channel = db.latestVideos.find((c) => c.channelId === channelId);
  if (!channel) return;
  return channel;
}

export function setLatestVideo(
  channelId: string,
  videoId: string,
  type: "video" | "short"
) {
  const channel = db.latestVideos.find((c) => c.channelId === channelId);
  if (!channel) return;
  const key = type === "video" ? "latestVideoId" : "latestShortId";
  channel[key] = videoId;
}

setInterval(async () => {
  await Bun.write(dbPath, JSON.stringify(db));
}, 10_000);
