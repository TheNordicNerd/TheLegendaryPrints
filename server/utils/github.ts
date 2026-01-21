import { Octokit } from "@octokit/rest";

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  projectNumber: number;
}

export interface CreateIssueParams {
  title: string;
  body: string;
  labels?: string[];
  assignees?: string[];
}

export interface UpdateIssueParams {
  issueNumber: number;
  state?: "open" | "closed";
  labels?: string[];
  body?: string;
}

export function createGitHubClient(config: GitHubConfig) {
  const octokit = new Octokit({
    auth: config.token,
  });

  return {
    async createIssue(params: CreateIssueParams) {
      const { data } = await octokit.rest.issues.create({
        owner: config.owner,
        repo: config.repo,
        title: params.title,
        body: params.body,
        labels: params.labels,
        assignees: params.assignees,
      });
      return data;
    },

    async updateIssue(params: UpdateIssueParams) {
      const { data } = await octokit.rest.issues.update({
        owner: config.owner,
        repo: config.repo,
        issue_number: params.issueNumber,
        state: params.state,
        labels: params.labels,
        body: params.body,
      });
      return data;
    },

    async addIssueComment(issueNumber: number, comment: string) {
      const { data } = await octokit.rest.issues.createComment({
        owner: config.owner,
        repo: config.repo,
        issue_number: issueNumber,
        body: comment,
      });
      return data;
    },

    async listIssues(labels?: string[]) {
      const { data } = await octokit.rest.issues.listForRepo({
        owner: config.owner,
        repo: config.repo,
        labels: labels?.join(","),
        state: "open",
      });
      return data;
    },

    async getIssue(issueNumber: number) {
      const { data } = await octokit.rest.issues.get({
        owner: config.owner,
        repo: config.repo,
        issue_number: issueNumber,
      });
      return data;
    },
  };
}

export function getGitHubConfig(): GitHubConfig {
  const config = useRuntimeConfig();

  const token = config.githubToken || process.env.GITHUB_TOKEN;
  const owner = config.public.githubOwner || process.env.GITHUB_OWNER;
  const repo = config.public.currentRepo || process.env.GITHUB_REPO;
  const projectNumber = config.public.currentProject || parseInt(process.env.GITHUB_PROJECT_NUMBER || "1");

  if (!token || !owner || !repo) {
    throw new Error("Missing required GitHub configuration. Check GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO environment variables.");
  }

  return {
    token,
    owner,
    repo,
    projectNumber,
  };
}
