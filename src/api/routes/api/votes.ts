import { Hono } from "hono";
import { getVote, getVotes } from "@/utils/db";

export const votes = new Hono();

votes.get("/", (c) => {
  const votes = getVotes();
  return c.json(votes);
});

votes.get("/:id", (c) => {
  const vote = getVote(c.req.param("id"));
  if (!vote) return c.json({ error: "Vote not found" }, 404);
  return c.json(vote);
});
