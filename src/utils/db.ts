import { exists } from "node:fs/promises";
import { join } from "node:path";

interface Database {
  users: {
    id: string;
    graphs: number;
  }[];
}

const dbPath = join(process.cwd(), "db.json");

async function initDatabase() {
  if (!(await exists(dbPath))) {
    await Bun.write(
      dbPath,
      JSON.stringify({
        users: [],
      })
    );
  }
}

await initDatabase();

const dbFile = Bun.file(dbPath);
const db: Database = await dbFile.json();

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

export async function addGraphs(id: string, graphs: number) {
  const userIndex = db.users.findIndex((c) => c.id === id);
  if (userIndex === -1)
    return db.users.push({
      id,
      graphs,
    });
  db.users[userIndex].graphs += graphs;
}

setInterval(async () => {
  await Bun.write(dbPath, JSON.stringify(db));
}, 10_000);
