import { createGitHubClient, getGitHubConfig } from "~~/server/utils/github";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issueNumber, summary, componentsStyled, responsive } = body;

    if (!issueNumber || !summary) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields: issueNumber and summary",
      });
    }

    const config = getGitHubConfig();
    const github = createGitHubClient(config);

    const comment = `## UI Development Complete ✅

${summary}

**Components Styled:**
${componentsStyled ? componentsStyled.map((c: string) => `- ${c}`).join("\n") : "No components specified"}

**Responsive:** ${responsive ? "✅ Yes" : "⚠️ Not verified"}

Ready for Content phase.`;

    await github.addIssueComment(issueNumber, comment);

    await github.updateIssue({
      issueNumber,
      labels: ["ui-complete"],
    });

    return {
      success: true,
      issueNumber,
      phase: "ui",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to mark UI phase as complete: ${error.message}`,
    });
  }
});
