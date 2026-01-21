import { createGitHubClient, getGitHubConfig } from "~~/server/utils/github";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, description, phases } = body;

    if (!title || !description) {
      throw createError({
        statusCode: 400,
        message: "Missing required fields: title and description",
      });
    }

    const config = getGitHubConfig();
    const github = createGitHubClient(config);

    // Create parent issue (user story)
    const parentIssue = await github.createIssue({
      title: `[Story] ${title}`,
      body: `## User Story\n\n${description}\n\n## Phases\n\nThis story is broken down into the following phases:\n\n${phases ? phases.map((p: any, i: number) => `${i + 1}. ${p.name}: ${p.description}`).join("\n") : ""}`,
      labels: ["story", "parent"],
    });

    // Create sub-tasks for each phase
    const phaseLabels = ["functional", "ui", "content", "accessibility"];
    const subTasks = [];

    if (phases && Array.isArray(phases)) {
      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i];
        const label = phaseLabels[i] || "task";

        const subTask = await github.createIssue({
          title: `[${label}] ${phase.name}`,
          body: `${phase.description}\n\n**Parent Story:** #${parentIssue.number}\n\n${phase.requirements ? `## Requirements\n\n${phase.requirements}` : ""}`,
          labels: [label, "sub-task"],
        });

        subTasks.push(subTask);

        // Add comment linking sub-task to parent
        await github.addIssueComment(
          parentIssue.number,
          `Sub-task created: #${subTask.number} - ${phase.name}`,
        );
      }
    }

    return {
      success: true,
      parentIssue: {
        number: parentIssue.number,
        url: parentIssue.html_url,
      },
      subTasks: subTasks.map((task) => ({
        number: task.number,
        url: task.html_url,
        title: task.title,
      })),
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to create GitHub story: ${error.message}`,
    });
  }
});
