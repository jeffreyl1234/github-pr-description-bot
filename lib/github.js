import { App } from "@octokit/app";

function getPrivateKey() {
  const key = process.env.GITHUB_PRIVATE_KEY ?? "";
  // If it doesn't contain PEM headers, assume base64-encoded
  if (!key.includes("-----")) {
    return Buffer.from(key, "base64").toString("utf-8");
  }
  return key.replace(/\\n/g, "\n");
}

function getApp() {
  return new App({
    appId: process.env.GITHUB_APP_ID,
    privateKey: getPrivateKey(),
  });
}

export async function getInstallationOctokit(installationId) {
  const app = getApp();
  return app.getInstallationOctokit(installationId);
}

export async function postComment(octokit, owner, repo, pullNumber, body) {
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: pullNumber,
    body,
  });
}
