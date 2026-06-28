export type Surface = "inbox" | "channels" | "replies" | "agents" | "wallet" | "settings" | "home";

export type VerificationState = "verified" | "pending" | "unverified";

export type TrustProof = {
  label: string;
  state: VerificationState;
  detail: string;
};

export type InboxThread = {
  id: string;
  subject: string;
  correspondent: string;
  preview: string;
  unread: boolean;
  labels: string[];
  updatedAt: string;
  route: "simplex-local";
  trust: TrustProof[];
};

export type ChannelPost = {
  id: string;
  author: string;
  title: string;
  body: string;
  replyCount: number;
  repostCount: number;
  createdAt: string;
  certified: boolean;
};

export type TopicChannel = {
  id: string;
  slug: string;
  title: string;
  charter: string;
  steward: string;
  status: "approved" | "requested" | "paused";
  costStatus: "healthy" | "watch" | "restricted";
  posts: ChannelPost[];
  trust: TrustProof[];
};

export type ChannelRequest = {
  id: string;
  requestedSlug: string;
  requestedBy: string;
  rationale: string;
  status: "draft" | "submitted" | "under-review" | "accepted" | "declined";
};

export type AgentPolicy = {
  id: string;
  name: string;
  provider: "design-placeholder" | "claude" | "openai" | "custom" | "local";
  enabled: boolean;
  permissions: string[];
  auditSummary: string;
};

export type NativeStatus = {
  runtime: "web" | "tauri";
  simplexRunner: "not-configured" | "mock-connected" | "connected" | "error";
  registry: "mock" | "local" | "ic";
};

export type FreexsterState = {
  activeSurface: Surface;
  activeThreadId: string;
  activeChannelId: string;
  nativeStatus: NativeStatus;
  inboxThreads: InboxThread[];
  channels: TopicChannel[];
  channelRequests: ChannelRequest[];
  agents: AgentPolicy[];
};
