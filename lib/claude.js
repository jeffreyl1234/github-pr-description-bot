import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_PROMPT =
  "You are a GitHub PR description generator. Given a diff and commit messages, " +
  "write a concise PR description in markdown. Focus on: what changed and why. " +
  "Include a short Testing section. Be factual — do not invent context. " +
  "Output only the markdown, no preamble.";

export async function generateDescription({ files, commits, diff }) {
  const userContent = [
    `## Commit Messages\n${commits.map((m) => `- ${m}`).join("\n")}`,
    `## Changed Files\n${files.map((f) => `- ${f}`).join("\n")}`,
    `## Diff\n\`\`\`diff\n${diff}\n\`\`\``,
  ].join("\n\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const block = response.content.find((b) => b.type === "text");
  return block ? block.text : null;
}
