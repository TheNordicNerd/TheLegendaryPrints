import { createGitHubClient, getGitHubConfig } from "~~/server/utils/github";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issueNumber, status, comment } = body;

    if (!issueNumber) {
      throw createError({
        statusCode: 400,
        message: "Missing required field: issueNumber",
      });
    }

    const config = getGitHubConfig();
    const github = createGitHubClient(config);

    // Update issue status
    if (status) {
      await github.updateIssue({
        issueNumber,
        state: status === "closed" ? "closed" : "open",
        labels: status === "in-progress" ? ["in-progress"] : undefined,
      });
    }

    // Add comment if provided
    if (comment) {
      await github.addIssueComment(issueNumber, comment);
    }

    return {
      success: true,
      issueNumber,
      status,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to update issue status: ${error.message}`,
    });
  }
});
