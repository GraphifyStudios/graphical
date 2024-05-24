import { exists } from "node:fs/promises";
import { join } from "node:path";

interface Database {
  users: {
    id: string;
    graphs: number;
  }[];
  votes: {
    id: string;
    votes: number;
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

export function getUser(id: string) {
  const user = db.users.find((c) => c.id === id);
  if (!user) {
    const data = {
      id,
      graphs: 0,
    } satisfies Database["users"][number];
    db.users.push(data);
    return data;
  }
  return user;
}

export function addGraphs(id: string, graphs: number) {
  const userIndex = db.users.findIndex((c) => c.id === id);
  if (userIndex === -1)
    return db.users.push({
      id,
      graphs,
    });
  db.users[userIndex].graphs += graphs;
}

export function setGraphs(id: string, graphs: number) {
  const userIndex = db.users.findIndex((c) => c.id === id);
  if (userIndex === -1)
    return db.users.push({
      id,
      graphs,
    });
  db.users[userIndex].graphs = graphs;
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
  if (voteIndex === -1)
    return db.votes.push({
      id,
      votes: 1,
    });
  db.votes[voteIndex].votes += 1;
}

setInterval(async () => {
  await Bun.write(dbPath, JSON.stringify(db));
}, 10_000);
