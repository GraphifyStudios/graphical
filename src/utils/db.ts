import { exists, mkdir } from "node:fs/promises";
import { join } from "node:path";

interface Database {
  users: {
    id: string;
    name: string;
    avatar: string;
    graphs: number;
    messages: number;
    lastMessageTime?: number;
    cooldowns: {
      command: string;
      time: number;
    }[];
    lastHourly: {
      graphs: number;
      hours: number;
    };
    lastDaily: {
      graphs: number;
      hours: number;
    };
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
  counting: {
    count: number;
    lastCounters: {
      id: string;
      name: string;
      count: number;
    }[];
  };
  isDropped: boolean;
}

export type User = Database["users"][number];

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
        counting: {
          count: 0,
          lastCounters: [],
        },
        isDropped: false,
      } satisfies Database)
    );
  }
}

await initDatabase();

const dbFile = Bun.file(dbPath);
const db: Database = await dbFile.json();

export function createUser(
  data: Partial<Database["users"][number]> &
    Pick<Database["users"][number], "id" | "name" | "avatar">
) {
  const userData = Object.assign(data || {}, {
    graphs: 0,
    messages: 0,
    lastMessageTime: undefined,
    cooldowns: [],
    lastHourly: {
      graphs: 0,
      hours: 0,
    },
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
    Pick<Database["users"][number], "id" | "name" | "avatar">
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

export function getCooldown(id: string, command: string) {
  const user = getUser(id);
  if (!user) return null;
  return (
    user.cooldowns.find((cooldown) => cooldown.command === command) ?? null
  );
}

export function addCooldown(id: string, command: string) {
  const user = getUser(id);
  if (!user) return;

  const cooldownIndex = user.cooldowns.findIndex(
    (cooldown) => cooldown.command === command
  );
  if (cooldownIndex !== -1) user.cooldowns[cooldownIndex].time = Date.now();
  else user.cooldowns.push({ command, time: Date.now() });

  setUser(id, user);
}

export function isDropped() {
  return db.isDropped;
}

export function toggleDropped() {
  db.isDropped = !db.isDropped;
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

export function getCount() {
  return db.counting.count;
}

export function addToCount() {
  db.counting.count += 1;
}

export function getLastCounters() {
  return [...db.counting.lastCounters];
}

export function addToLastCounters(data: {
  id: string;
  name: string;
  count: number;
}) {
  let lastCounters = getLastCounters();
  if (lastCounters.length > 9) lastCounters = lastCounters.slice(0, 9);

  lastCounters.unshift(data);
  db.counting.lastCounters = lastCounters;
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
