export interface GitHubRepo {
  id: number;
  name: string;
  url: string;
}

export interface GitHubActor {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

export interface GitHubCommit {
  sha: string;
  author: { email: string; name: string };
  message: string;
  distinct: boolean;
  url: string;
}

export interface GitHubForkee {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
}

export interface GitHubMember {
  login: string;
  id: number;
  type: string;
}

export interface GitHubEventPayload {
  action?: string;
  ref?: string;
  ref_type?: string;
  commits?: GitHubCommit[];
  forkee?: GitHubForkee;
  release?: GitHubRelease;
  member?: GitHubMember;
  size?: number;
  before?: string;
  head?: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: GitHubActor;
  repo: GitHubRepo;
  payload: GitHubEventPayload;
  public: boolean;
  created_at: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface ApiActivityResponse {
  username: string;
  count: number;
  activity: GitHubEvent[];
}
