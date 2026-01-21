import { createGitHubClient, getGitHubConfig } from "~~/server/utils/github";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issueNumber, summary, filesChanged, testsPass } = body;

    if (!issueNumber || !summary) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields: issueNumber and summary",
      });
    }

    const config = getGitHubConfig();
    const github = createGitHubClient(config);

    const comment = `## Functional Development Complete ✅

${summary}

**Files Changed:**
${filesChanged ? filesChanged.map((f: string) => `- ${f}`).join("\n") : "No files specified"}

**Tests Status:** ${testsPass ? "✅ Passing" : "⚠️ Not verified"}

Ready for UI phase.`;

    await github.addIssueComment(issueNumber, comment);

    await github.updateIssue({
      issueNumber,
      labels: ["functional-complete"],
    });

    return {
      success: true,
      issueNumber,
      phase: "functional",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to mark functional phase as complete: ${error.message}`,
    });
  }
});
