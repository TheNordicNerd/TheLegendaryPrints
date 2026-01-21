import { createGitHubClient, getGitHubConfig } from "~~/server/utils/github";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { issueNumber, summary, wcagCompliant, lighthouseScore, issuesFixed } = body;

    if (!issueNumber || !summary) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields: issueNumber and summary",
      });
    }

    const config = getGitHubConfig();
    const github = createGitHubClient(config);

    const comment = `## Accessibility Audit Complete ✅

${summary}

**WCAG 2.1 AA Compliant:** ${wcagCompliant ? "✅ Yes" : "⚠️ Issues found"}

**Lighthouse Accessibility Score:** ${lighthouseScore || "Not provided"}

**Issues Fixed:**
${issuesFixed ? issuesFixed.map((i: string) => `- ${i}`).join("\n") : "No issues specified"}

Feature is ready for production! 🚀`;

    await github.addIssueComment(issueNumber, comment);

    await github.updateIssue({
      issueNumber,
      labels: ["accessibility-complete", "ready-for-production"],
    });

    return {
      success: true,
      issueNumber,
      phase: "accessibility",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to mark Accessibility phase as complete: ${error.message}`,
    });
  }
});
