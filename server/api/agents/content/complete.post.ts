import { createGitHubClient, getGitHubConfig } from "~~/server/utils/github";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issueNumber, summary, seoKeywords, contentPages } = body;

    if (!issueNumber || !summary) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields: issueNumber and summary",
      });
    }

    const config = getGitHubConfig();
    const github = createGitHubClient(config);

    const comment = `## Content & SEO Complete ✅

${summary}

**SEO Keywords:**
${seoKeywords ? seoKeywords.map((k: string) => `- ${k}`).join("\n") : "No keywords specified"}

**Content Pages:**
${contentPages ? contentPages.map((p: string) => `- ${p}`).join("\n") : "No pages specified"}

Ready for Accessibility phase.`;

    await github.addIssueComment(issueNumber, comment);

    await github.updateIssue({
      issueNumber,
      labels: ["content-complete"],
    });

    return {
      success: true,
      issueNumber,
      phase: "content",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to mark Content phase as complete: ${error.message}`,
    });
  }
});
