const MAX_DIFF_CHARS = 8000;

export async function fetchDiff(octokit, owner, repo, pullNumber) {
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner,
      repo,
      pull_number: pullNumber,
      headers: { accept: "application/vnd.github.v3.diff" },
    }
  );

  const diffText = String(response.data);
  const total = diffText.length;
  const diff =
    total > MAX_DIFF_CHARS
      ? diffText.slice(0, MAX_DIFF_CHARS) +
        `\n[diff truncated — showing first ${MAX_DIFF_CHARS} chars of ${total} total]`
      : diffText;

  const seen = new Set();
  const files = [];
  for (const line of diffText.split("\n")) {
    if (line.startsWith("+++ b/")) {
      const file = line.slice(6);
      if (!seen.has(file)) {
        seen.add(file);
        files.push(file);
      }
    }
  }

  return { diff, files };
}

export async function fetchCommits(octokit, owner, repo, pullNumber) {
  const { data } = await octokit.rest.pulls.listCommits({
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 10,
  });
  return data.map((c) => c.commit.message.split("\n")[0]);
}
