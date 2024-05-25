import { exists, mkdir } from "node:fs/promises";
import { join } from "node:path";

interface Database {
  users: {
    id: string;
    name: string;
    graphs: number;
    messages: number;
    lastMessageTime?: number;
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

export function createUser(
  data: Partial<Database["users"][number]> &
    Pick<Database["users"][number], "id" | "name">
) {
  const userData = Object.assign(data || {}, {
    graphs: 0,
    messages: 0,
    lastMessageTime: undefined,
  }) as Database["users"][number];
  db.users.push(userData);
  return userData;
}

export function getUsers() {
  return [...db.users];
}

export function getUser(id: string) {
  const user = db.users.find((c) => c.id === id);
  if (!user) return null;
  return user;
}

export function ensureUser(
  id: string,
  data: Partial<Database["users"][number]> &
    Pick<Database["users"][number], "id" | "name">
) {
  const user = getUser(id);
  if (user) return user;
  return createUser(data);
}

export function isNewUser(id: string) {
  const user = db.users.find((c) => c.id === id);
  return !user;
}

export function setUser(id: string, data: Partial<Database["users"][number]>) {
  const userIndex = db.users.findIndex((c) => c.id === id);
  if (userIndex === -1) throw new Error("User not found");
  db.users[userIndex] = Object.assign(db.users[userIndex], data);
}

export function addGraphs(id: string, graphs: number) {
  const user = getUser(id);
  if (!user) throw new Error("User not found");
  user.graphs += graphs;
  setUser(id, user);
}

export function getVotes() {
  return [...db.votes];
}

export function getVote(id: string) {
  const vote = db.votes.find((c) => c.id === id);
  if (!vote) return null;
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

const backupsPath = join(process.cwd(), "backups");

setInterval(async () => {
  if (!(await exists(backupsPath))) await mkdir(backupsPath);
  await Bun.write(
    join(backupsPath, `db-${Date.now()}.json`),
    JSON.stringify(db)
  );

  await Bun.write(dbPath, JSON.stringify(db));
}, 10_000);
