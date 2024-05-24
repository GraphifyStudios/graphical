import { exists } from "node:fs/promises";
import { join } from "node:path";

interface Database {
  users: {
    id: string;
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
    const data = { id };
    db.users.push(data);
    return data;
  }
  return user;
}

setInterval(async () => {
  await Bun.write(dbPath, JSON.stringify(db));
}, 10_000);
