import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const adviceModel = openai(process.env.OPENAI_MODEL ?? "gpt-4o");

export const FALLBACK_ADVICE =
  "Play your normal shot and commit to it — no advice history yet for this hole.";
