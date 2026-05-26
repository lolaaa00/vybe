export interface GitHubProfile {
  id: number
  login: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  html_url: string
  public_repos: number
  followers: number
  following: number
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

export interface GitHubEvent {
  id: string
  type: string
  repo?: { name: string }
  created_at: string
}

export interface GitHubAccountData {
  profile: GitHubProfile
  repos: GitHubRepo[]
  languages: string[]
  recentActivity: GitHubEvent[]
}

async function githubFetch<T>(path: string, token: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchGitHubAccountData(token: string): Promise<GitHubAccountData> {
  const profile = await githubFetch<GitHubProfile>("/user", token)
  const repos = await githubFetch<GitHubRepo[]>(
    "/user/repos?type=owner&sort=updated&per_page=20",
    token
  )

  let recentActivity: GitHubEvent[] = []
  try {
    recentActivity = await githubFetch<GitHubEvent[]>(
      `/users/${encodeURIComponent(profile.login)}/events/public?per_page=20`,
      token
    )
  } catch {
    recentActivity = []
  }

  const languages = Array.from(
    new Set(repos.map((repo) => repo.language).filter(Boolean) as string[])
  ).slice(0, 8)

  return { profile, repos, languages, recentActivity }
}
