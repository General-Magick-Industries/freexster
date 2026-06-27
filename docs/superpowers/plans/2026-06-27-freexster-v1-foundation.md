# Freexster V1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first working Freexster foundation: a tested React/Tauri desktop-first shell with private inbox, curated topic channels, trust panels, channel requests, homepage/download copy, and mocked SimpleX/ICP adapter boundaries.

**Architecture:** The first slice is a shared TypeScript domain model, adapter interfaces, in-memory demo clients, and a React desktop app shell wrapped by a minimal Tauri v2 desktop runtime. SimpleX runner control and ICP canister deployment attach behind adapter boundaries in follow-on plans after the UI contract is stable.

**Tech Stack:** Node 24, npm 11, React, TypeScript, Vite, Vitest, Testing Library, Tauri v2, Rust 1.94, lucide-react.

---

## Scope Check

The approved design covers multiple subsystems: desktop app, SimpleX adapter, ICP registry, public channels, homepage, trust/security, and future agents. This plan intentionally implements the first testable vertical slice only:

- shared domain model;
- mocked adapter layer for SimpleX, registry, and public channels;
- desktop-first React app shell;
- ICP-hostable homepage surface;
- Tauri wrapper with a native status command;
- tests and docs for the boundaries.

Real SimpleX runner process management, real ICP canisters, certified variables, vetKeys, confidential subnet deployment, installer signing, mobile apps, and live agent execution each need separate implementation plans after this foundation works.

## File Structure

Create and maintain these units:

- `package.json`: npm scripts and dependencies.
- `index.html`, `vite.config.ts`, `tsconfig*.json`, `vitest.setup.ts`: frontend build and test configuration.
- `src/main.tsx`: browser/Tauri frontend entrypoint.
- `src/app/FreexsterApp.tsx`: top-level composition and view switching.
- `src/app/useFreexsterData.ts`: state loading and adapter orchestration.
- `src/domain/types.ts`: product domain types.
- `src/domain/fixtures.ts`: deterministic v1 demo data.
- `src/domain/selectors.ts`: pure derived-data helpers.
- `src/adapters/freexsterClient.ts`: adapter interfaces.
- `src/adapters/mockFreexsterClient.ts`: in-memory demo adapter.
- `src/adapters/nativeStatus.ts`: Tauri native status bridge with web fallback.
- `src/components/*.tsx`: focused UI components.
- `src/styles.css`: app styling.
- `src-tauri/*`: minimal Tauri v2 wrapper and native status command.
- `docs/architecture/foundation-boundaries.md`: records what is real, mocked, and deliberately out of scope.

## Task 1: Frontend Toolchain And Smoke Test

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/main.tsx`
- Create: `src/app/FreexsterApp.tsx`
- Create: `src/app/FreexsterApp.test.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create the failing app smoke test**

Create `src/app/FreexsterApp.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FreexsterApp } from "./FreexsterApp";

describe("FreexsterApp", () => {
  it("renders the approved working title and v1 positioning", () => {
    render(<FreexsterApp />);

    expect(screen.getByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(screen.getByText("Private inbox + public topic channels + trust registry")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Add npm/build configuration**

Create `package.json`:

```json
{
  "name": "freexster",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "tauri": "tauri"
  },
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^25.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Freexster</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src", "vitest.setup.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add the minimal app implementation**

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { FreexsterApp } from "./app/FreexsterApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FreexsterApp />
  </React.StrictMode>,
);
```

Create `src/app/FreexsterApp.tsx`:

```tsx
export function FreexsterApp() {
  return (
    <main className="app-boot">
      <p className="eyebrow">Working title</p>
      <h1>Freexster</h1>
      <p>Private inbox + public topic channels + trust registry</p>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #171717;
  background: #f7f5ef;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app-boot {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 10px;
  padding: 32px;
  text-align: center;
}

.app-boot h1 {
  margin: 0;
  font-size: 48px;
  letter-spacing: 0;
}

.app-boot p {
  margin: 0;
  color: #4f555f;
}

.eyebrow {
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 750;
  color: #0f766e;
}
```

- [ ] **Step 4: Install dependencies and verify the smoke test passes**

Run:

```powershell
npm install
npm test -- src/app/FreexsterApp.test.tsx
```

Expected: the test run reports `1 passed`.

- [ ] **Step 5: Verify the production build**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite complete without errors and write `dist/`.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts vitest.setup.ts src
git commit -m "feat: add frontend toolchain"
```

## Task 2: Domain Model And Fixtures

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/fixtures.ts`
- Create: `src/domain/selectors.ts`
- Create: `src/domain/selectors.test.ts`

- [ ] **Step 1: Write selector tests**

Create `src/domain/selectors.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { demoState } from "./fixtures";
import { getActiveChannel, getActiveThread, getUnreadInboxCount, listApprovedChannels } from "./selectors";

describe("domain selectors", () => {
  it("counts only unread private inbox threads", () => {
    expect(getUnreadInboxCount(demoState)).toBe(2);
  });

  it("returns the selected private thread", () => {
    expect(getActiveThread(demoState)?.subject).toBe("SimpleX onboarding notes");
  });

  it("lists only approved public channels", () => {
    expect(listApprovedChannels(demoState).map((channel) => channel.slug)).toEqual([
      "freexster-design",
      "simplex-onboarding",
      "icp-trust-network",
    ]);
  });

  it("returns the selected public channel", () => {
    expect(getActiveChannel(demoState)?.title).toBe("Freexster Design");
  });
});
```

- [ ] **Step 2: Run tests and confirm missing modules fail**

Run:

```powershell
npm test -- src/domain/selectors.test.ts
```

Expected: fails because `fixtures` and `selectors` do not exist.

- [ ] **Step 3: Create domain types**

Create `src/domain/types.ts`:

```ts
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
```

- [ ] **Step 4: Create deterministic fixtures**

Create `src/domain/fixtures.ts`:

```ts
import type { FreexsterState } from "./types";

export const demoState: FreexsterState = {
  activeSurface: "inbox",
  activeThreadId: "thread-simplex-onboarding",
  activeChannelId: "channel-freexster-design",
  nativeStatus: {
    runtime: "web",
    simplexRunner: "mock-connected",
    registry: "mock",
  },
  inboxThreads: [
    {
      id: "thread-simplex-onboarding",
      subject: "SimpleX onboarding notes",
      correspondent: "Ari",
      preview: "Desktop-first runner integration keeps the private inbox local.",
      unread: true,
      labels: ["SimpleX", "v1"],
      updatedAt: "2026-06-27T08:30:00Z",
      route: "simplex-local",
      trust: [
        { label: "SimpleX contact", state: "pending", detail: "Contact proof ready for verification." },
        { label: "Registry identity", state: "verified", detail: "Principal linked to Freexster registry." },
      ],
    },
    {
      id: "thread-agent-model",
      subject: "Agent permissions model",
      correspondent: "Maya",
      preview: "Agents stay visible in the architecture but execution is not in v1.",
      unread: true,
      labels: ["Agents", "Permissions"],
      updatedAt: "2026-06-27T07:10:00Z",
      route: "simplex-local",
      trust: [{ label: "Canister proof", state: "verified", detail: "Policy hash is anchored in the registry." }],
    },
    {
      id: "thread-public-replies",
      subject: "Private replies from topic channels",
      correspondent: "Noor",
      preview: "A public channel post can open a private SimpleX reply path.",
      unread: false,
      labels: ["Channels"],
      updatedAt: "2026-06-26T23:45:00Z",
      route: "simplex-local",
      trust: [{ label: "Route", state: "verified", detail: "Private reply route stays off-chain." }],
    },
  ],
  channels: [
    {
      id: "channel-freexster-design",
      slug: "freexster-design",
      title: "Freexster Design",
      charter: "Product design, UX, and trust model decisions for the working-title Freexster project.",
      steward: "General Magick Industries",
      status: "approved",
      costStatus: "healthy",
      trust: [
        { label: "Channel canister", state: "pending", detail: "Mock canister proof until registry canister exists." },
        { label: "Founder steward", state: "verified", detail: "Launch steward is explicitly listed." },
      ],
      posts: [
        {
          id: "post-inbox-first",
          author: "Mark",
          title: "Inbox-first is the product spine",
          body: "Freexster starts as a personal communications home, then grows outward into public identity, agents, and wallet trust.",
          replyCount: 8,
          repostCount: 1,
          createdAt: "2026-06-27T09:00:00Z",
          certified: true,
        },
      ],
    },
    {
      id: "channel-simplex-onboarding",
      slug: "simplex-onboarding",
      title: "SimpleX Onboarding",
      charter: "Helping people understand the downloaded app, local runner, and private inbox boundaries.",
      steward: "Freexster launch team",
      status: "approved",
      costStatus: "healthy",
      trust: [{ label: "Posting policy", state: "verified", detail: "Curated channel with public request path." }],
      posts: [],
    },
    {
      id: "channel-icp-trust-network",
      slug: "icp-trust-network",
      title: "ICP Trust Network",
      charter: "Registry, certified public reads, confidential subnet posture, and vetKeys design.",
      steward: "Freexster launch team",
      status: "approved",
      costStatus: "watch",
      trust: [{ label: "Cycle monitor", state: "pending", detail: "Cost controls required before permissionless channels." }],
      posts: [],
    },
    {
      id: "channel-autonomous-agents",
      slug: "autonomous-agents",
      title: "Autonomous Agents",
      charter: "Independent agent accounts, agent wallets, and public provenance.",
      steward: "Requested",
      status: "requested",
      costStatus: "restricted",
      trust: [{ label: "Request", state: "pending", detail: "Channel creation is curated in v1." }],
      posts: [],
    },
  ],
  channelRequests: [
    {
      id: "request-agent-comms",
      requestedSlug: "agent-comms",
      requestedBy: "Mark",
      rationale: "Design future robot-to-robot and AI-agent communications without making it a v1 dependency.",
      status: "under-review",
    },
  ],
  agents: [
    {
      id: "agent-design-placeholder",
      name: "Design Placeholder",
      provider: "design-placeholder",
      enabled: false,
      permissions: ["Read selected thread after user approval", "Draft response after user approval"],
      auditSummary: "No agent execution in v1; permissions model is visible for design review.",
    },
  ],
};
```

- [ ] **Step 5: Create pure selectors**

Create `src/domain/selectors.ts`:

```ts
import type { FreexsterState, TopicChannel } from "./types";

export function getUnreadInboxCount(state: FreexsterState): number {
  return state.inboxThreads.filter((thread) => thread.unread).length;
}

export function getActiveThread(state: FreexsterState) {
  return state.inboxThreads.find((thread) => thread.id === state.activeThreadId) ?? state.inboxThreads[0] ?? null;
}

export function listApprovedChannels(state: FreexsterState): TopicChannel[] {
  return state.channels.filter((channel) => channel.status === "approved");
}

export function getActiveChannel(state: FreexsterState) {
  return state.channels.find((channel) => channel.id === state.activeChannelId) ?? listApprovedChannels(state)[0] ?? null;
}
```

- [ ] **Step 6: Run tests**

Run:

```powershell
npm test -- src/domain/selectors.test.ts
```

Expected: `4 passed`.

- [ ] **Step 7: Commit**

```powershell
git add src/domain
git commit -m "feat: add Freexster domain model"
```

## Task 3: Adapter Interfaces And Mock Client

**Files:**
- Create: `src/adapters/freexsterClient.ts`
- Create: `src/adapters/mockFreexsterClient.ts`
- Create: `src/adapters/mockFreexsterClient.test.ts`

- [ ] **Step 1: Write adapter tests**

Create `src/adapters/mockFreexsterClient.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMockFreexsterClient } from "./mockFreexsterClient";

describe("createMockFreexsterClient", () => {
  it("loads deterministic Freexster state", async () => {
    const client = createMockFreexsterClient();
    const state = await client.loadState();

    expect(state.inboxThreads).toHaveLength(3);
    expect(state.channels.some((channel) => channel.slug === "freexster-design")).toBe(true);
  });

  it("submits channel requests without permissionless channel creation", async () => {
    const client = createMockFreexsterClient();
    const request = await client.submitChannelRequest({
      requestedSlug: "robot-comms",
      requestedBy: "Mark",
      rationale: "A curated channel for future robot-to-robot communications design.",
    });

    expect(request.status).toBe("submitted");
    expect(request.requestedSlug).toBe("robot-comms");

    const state = await client.loadState();
    expect(state.channels.some((channel) => channel.slug === "robot-comms")).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests and confirm adapter modules are missing**

Run:

```powershell
npm test -- src/adapters/mockFreexsterClient.test.ts
```

Expected: fails because the adapter modules do not exist.

- [ ] **Step 3: Create adapter contracts**

Create `src/adapters/freexsterClient.ts`:

```ts
import type { ChannelRequest, FreexsterState, NativeStatus } from "../domain/types";

export type ChannelRequestInput = {
  requestedSlug: string;
  requestedBy: string;
  rationale: string;
};

export type FreexsterClient = {
  loadState(): Promise<FreexsterState>;
  loadNativeStatus(): Promise<NativeStatus>;
  submitChannelRequest(input: ChannelRequestInput): Promise<ChannelRequest>;
};
```

- [ ] **Step 4: Create the mock client**

Create `src/adapters/mockFreexsterClient.ts`:

```ts
import type { ChannelRequest, FreexsterState } from "../domain/types";
import { demoState } from "../domain/fixtures";
import type { ChannelRequestInput, FreexsterClient } from "./freexsterClient";

function cloneState(): FreexsterState {
  return structuredClone(demoState);
}

export function createMockFreexsterClient(): FreexsterClient {
  let state = cloneState();

  return {
    async loadState() {
      return structuredClone(state);
    },
    async loadNativeStatus() {
      return structuredClone(state.nativeStatus);
    },
    async submitChannelRequest(input: ChannelRequestInput): Promise<ChannelRequest> {
      const request: ChannelRequest = {
        id: `request-${input.requestedSlug}`,
        requestedSlug: input.requestedSlug,
        requestedBy: input.requestedBy,
        rationale: input.rationale,
        status: "submitted",
      };

      state = {
        ...state,
        channelRequests: [request, ...state.channelRequests],
      };

      return structuredClone(request);
    },
  };
}
```

- [ ] **Step 5: Run tests**

Run:

```powershell
npm test -- src/adapters/mockFreexsterClient.test.ts
```

Expected: `2 passed`.

- [ ] **Step 6: Commit**

```powershell
git add src/adapters
git commit -m "feat: add Freexster adapter contracts"
```

## Task 4: App Data Hook And Navigation State

**Files:**
- Create: `src/app/useFreexsterData.ts`
- Modify: `src/app/FreexsterApp.tsx`
- Create: `src/app/useFreexsterData.test.tsx`

- [ ] **Step 1: Write hook tests**

Create `src/app/useFreexsterData.test.tsx`:

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMockFreexsterClient } from "../adapters/mockFreexsterClient";
import { useFreexsterData } from "./useFreexsterData";

describe("useFreexsterData", () => {
  it("loads state and switches surfaces", async () => {
    const { result } = renderHook(() => useFreexsterData(createMockFreexsterClient()));

    await waitFor(() => expect(result.current.status).toBe("ready"));

    result.current.setActiveSurface("channels");

    expect(result.current.state?.activeSurface).toBe("channels");
  });

  it("adds a submitted channel request", async () => {
    const { result } = renderHook(() => useFreexsterData(createMockFreexsterClient()));

    await waitFor(() => expect(result.current.status).toBe("ready"));

    await result.current.submitChannelRequest({
      requestedSlug: "trust-research",
      requestedBy: "Mark",
      rationale: "A curated channel for security and trust research.",
    });

    expect(result.current.state?.channelRequests[0].requestedSlug).toBe("trust-research");
    expect(result.current.state?.channelRequests[0].status).toBe("submitted");
  });
});
```

- [ ] **Step 2: Run tests and confirm the hook is missing**

Run:

```powershell
npm test -- src/app/useFreexsterData.test.tsx
```

Expected: fails because `useFreexsterData` does not exist.

- [ ] **Step 3: Implement the hook**

Create `src/app/useFreexsterData.ts`:

```ts
import { useEffect, useMemo, useState } from "react";
import type { ChannelRequestInput, FreexsterClient } from "../adapters/freexsterClient";
import type { FreexsterState, Surface } from "../domain/types";

type LoadStatus = "loading" | "ready" | "error";

export function useFreexsterData(client: FreexsterClient) {
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<FreexsterState | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedState = await client.loadState();
        if (!active) return;
        setState(loadedState);
        setStatus("ready");
      } catch (caught) {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : "Unable to load Freexster state.");
        setStatus("error");
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [client]);

  return useMemo(
    () => ({
      status,
      error,
      state,
      setActiveSurface(surface: Surface) {
        setState((current) => (current ? { ...current, activeSurface: surface } : current));
      },
      async submitChannelRequest(input: ChannelRequestInput) {
        const request = await client.submitChannelRequest(input);
        setState((current) =>
          current ? { ...current, channelRequests: [request, ...current.channelRequests] } : current,
        );
        return request;
      },
    }),
    [client, error, state, status],
  );
}
```

- [ ] **Step 4: Run hook tests**

Run:

```powershell
npm test -- src/app/useFreexsterData.test.tsx
```

Expected: `2 passed`.

- [ ] **Step 5: Keep `FreexsterApp.tsx` compiling**

No app UI change is required in this task. Run:

```powershell
npm run build
```

Expected: build passes.

- [ ] **Step 6: Commit**

```powershell
git add src/app/useFreexsterData.ts src/app/useFreexsterData.test.tsx src/app/FreexsterApp.tsx
git commit -m "feat: add Freexster app data hook"
```

## Task 5: Desktop App Shell

**Files:**
- Create: `src/components/AppShell.tsx`
- Create: `src/components/Sidebar.tsx`
- Create: `src/components/InboxPanel.tsx`
- Create: `src/components/ThreadPanel.tsx`
- Create: `src/components/TrustPanel.tsx`
- Modify: `src/app/FreexsterApp.tsx`
- Modify: `src/styles.css`
- Create: `src/components/AppShell.test.tsx`

- [ ] **Step 1: Write shell tests**

Create `src/components/AppShell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { demoState } from "../domain/fixtures";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders inbox, active thread, and trust context", () => {
    render(<AppShell state={demoState} onSurfaceChange={() => undefined} onSubmitChannelRequest={async () => undefined} />);

    expect(screen.getByText("Priority letters")).toBeInTheDocument();
    expect(screen.getByText("SimpleX onboarding notes")).toBeInTheDocument();
    expect(screen.getByText("Trust and stewardship")).toBeInTheDocument();
  });

  it("lets the user switch to channels", async () => {
    const user = userEvent.setup();
    let selected = demoState.activeSurface;

    render(<AppShell state={demoState} onSurfaceChange={(surface) => { selected = surface; }} onSubmitChannelRequest={async () => undefined} />);

    await user.click(screen.getByRole("button", { name: "Channels" }));

    expect(selected).toBe("channels");
  });
});
```

- [ ] **Step 2: Run tests and confirm components are missing**

Run:

```powershell
npm test -- src/components/AppShell.test.tsx
```

Expected: fails because `AppShell` does not exist.

- [ ] **Step 3: Implement `Sidebar.tsx`**

Create `src/components/Sidebar.tsx`:

```tsx
import { Bot, Inbox, RadioTower, Reply, Settings, WalletCards } from "lucide-react";
import type { Surface } from "../domain/types";

const items: Array<{ surface: Surface; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { surface: "inbox", label: "Inbox", icon: Inbox },
  { surface: "channels", label: "Channels", icon: RadioTower },
  { surface: "replies", label: "Replies", icon: Reply },
  { surface: "agents", label: "Agents", icon: Bot },
  { surface: "wallet", label: "Wallet", icon: WalletCards },
  { surface: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeSurface,
  onSurfaceChange,
}: {
  activeSurface: Surface;
  onSurfaceChange: (surface: Surface) => void;
}) {
  return (
    <nav className="sidebar" aria-label="Freexster surfaces">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.surface}
            className={item.surface === activeSurface ? "sidebar-item active" : "sidebar-item"}
            type="button"
            onClick={() => onSurfaceChange(item.surface)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 4: Implement inbox, thread, and trust panels**

Create `src/components/InboxPanel.tsx`:

```tsx
import type { InboxThread } from "../domain/types";

export function InboxPanel({ threads }: { threads: InboxThread[] }) {
  return (
    <aside className="panel">
      <div className="panel-label">Private inbox</div>
      <h2>Priority letters</h2>
      <div className="stack">
        {threads.map((thread) => (
          <article className={thread.unread ? "list-card unread" : "list-card"} key={thread.id}>
            <strong>{thread.subject}</strong>
            <span>{thread.correspondent}</span>
            <p>{thread.preview}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
```

Create `src/components/ThreadPanel.tsx`:

```tsx
import type { InboxThread } from "../domain/types";

export function ThreadPanel({ thread }: { thread: InboxThread | null }) {
  if (!thread) {
    return <section className="reader">No private thread selected.</section>;
  }

  return (
    <section className="reader">
      <div className="panel-label">Private SimpleX-backed letter/chat</div>
      <h2>{thread.subject}</h2>
      <p className="lede">{thread.preview}</p>
      <div className="composer">Composer: reply privately, draft a public post, or prepare an agent handoff.</div>
      <div className="actions">
        <button className="primary" type="button">Reply</button>
        <button type="button">Archive</button>
        <button type="button">@agent</button>
      </div>
    </section>
  );
}
```

Create `src/components/TrustPanel.tsx`:

```tsx
import type { TrustProof } from "../domain/types";

export function TrustPanel({ proofs }: { proofs: TrustProof[] }) {
  return (
    <aside className="context-panel">
      <div className="panel-label">Trust and stewardship</div>
      <h2>Proofs</h2>
      <div className="stack">
        {proofs.map((proof) => (
          <article className="proof-card" key={`${proof.label}-${proof.detail}`}>
            <span className={`proof-state ${proof.state}`}>{proof.state}</span>
            <strong>{proof.label}</strong>
            <p>{proof.detail}</p>
          </article>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Implement `AppShell.tsx`**

Create `src/components/AppShell.tsx`:

```tsx
import type { ChannelRequestInput } from "../adapters/freexsterClient";
import { getActiveChannel, getActiveThread } from "../domain/selectors";
import type { FreexsterState, Surface } from "../domain/types";
import { ChannelsPanel } from "./ChannelsPanel";
import { InboxPanel } from "./InboxPanel";
import { PlaceholderSurface } from "./PlaceholderSurface";
import { Sidebar } from "./Sidebar";
import { ThreadPanel } from "./ThreadPanel";
import { TrustPanel } from "./TrustPanel";

export function AppShell({
  state,
  onSurfaceChange,
  onSubmitChannelRequest,
}: {
  state: FreexsterState;
  onSurfaceChange: (surface: Surface) => void;
  onSubmitChannelRequest: (input: ChannelRequestInput) => Promise<void>;
}) {
  const activeThread = getActiveThread(state);
  const activeChannel = getActiveChannel(state);
  const trustProofs = state.activeSurface === "channels" && activeChannel ? activeChannel.trust : activeThread?.trust ?? [];

  return (
    <div className="desktop-frame">
      <header className="topbar">
        <div>
          <strong>Freexster</strong>
          <span>Private inbox + public topic channels + trust registry</span>
        </div>
        <span>{state.nativeStatus.simplexRunner} · {state.nativeStatus.registry}</span>
      </header>
      <div className="workspace">
        <Sidebar activeSurface={state.activeSurface} onSurfaceChange={onSurfaceChange} />
        {state.activeSurface === "inbox" ? (
          <>
            <InboxPanel threads={state.inboxThreads} />
            <ThreadPanel thread={activeThread} />
          </>
        ) : state.activeSurface === "channels" ? (
          <ChannelsPanel state={state} onSubmitChannelRequest={onSubmitChannelRequest} />
        ) : (
          <PlaceholderSurface surface={state.activeSurface} agents={state.agents} />
        )}
        <TrustPanel proofs={trustProofs} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Add temporary missing components used by `AppShell`**

Create `src/components/ChannelsPanel.tsx`:

```tsx
import type { ChannelRequestInput } from "../adapters/freexsterClient";
import { getActiveChannel, listApprovedChannels } from "../domain/selectors";
import type { FreexsterState } from "../domain/types";

export function ChannelsPanel({
  state,
  onSubmitChannelRequest,
}: {
  state: FreexsterState;
  onSubmitChannelRequest: (input: ChannelRequestInput) => Promise<void>;
}) {
  const activeChannel = getActiveChannel(state);
  const channels = listApprovedChannels(state);

  return (
    <>
      <aside className="panel">
        <div className="panel-label">Approved channels</div>
        <h2>Topic channels</h2>
        <div className="stack">
          {channels.map((channel) => (
            <article className="list-card" key={channel.id}>
              <strong>#{channel.slug}</strong>
              <p>{channel.charter}</p>
            </article>
          ))}
        </div>
      </aside>
      <section className="reader">
        <div className="panel-label">Public channel</div>
        <h2>{activeChannel?.title ?? "No channel selected"}</h2>
        <p className="lede">{activeChannel?.charter}</p>
        <button
          type="button"
          onClick={() =>
            void onSubmitChannelRequest({
              requestedSlug: "robot-comms",
              requestedBy: "Mark",
              rationale: "A curated channel for future robot-to-robot communications design.",
            })
          }
        >
          Request a channel
        </button>
      </section>
    </>
  );
}
```

Create `src/components/PlaceholderSurface.tsx`:

```tsx
import type { AgentPolicy, Surface } from "../domain/types";

export function PlaceholderSurface({ surface, agents }: { surface: Surface; agents: AgentPolicy[] }) {
  const title = surface[0].toUpperCase() + surface.slice(1);

  return (
    <>
      <aside className="panel">
        <div className="panel-label">{title}</div>
        <h2>{title}</h2>
        <p>This surface is part of the v1 shell so the information architecture is honest from the outset.</p>
      </aside>
      <section className="reader">
        <div className="panel-label">Design-ready surface</div>
        {surface === "agents" ? (
          agents.map((agent) => (
            <article className="list-card" key={agent.id}>
              <strong>{agent.name}</strong>
              <p>{agent.auditSummary}</p>
            </article>
          ))
        ) : (
          <p className="lede">This area is available for permissions, identity, and stewardship controls as the product matures.</p>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 7: Wire the app shell**

Replace `src/app/FreexsterApp.tsx` with:

```tsx
import { useMemo } from "react";
import { createMockFreexsterClient } from "../adapters/mockFreexsterClient";
import { AppShell } from "../components/AppShell";
import { useFreexsterData } from "./useFreexsterData";

export function FreexsterApp() {
  const client = useMemo(() => createMockFreexsterClient(), []);
  const data = useFreexsterData(client);

  if (data.status === "loading") {
    return <main className="app-boot">Loading Freexster...</main>;
  }

  if (data.status === "error" || !data.state) {
    return <main className="app-boot">Freexster could not load: {data.error}</main>;
  }

  return (
    <AppShell
      state={data.state}
      onSurfaceChange={data.setActiveSurface}
      onSubmitChannelRequest={async (input) => {
        await data.submitChannelRequest(input);
      }}
    />
  );
}
```

- [ ] **Step 8: Replace CSS with the desktop shell styling**

Replace `src/styles.css` with:

```css
:root {
  color: #171717;
  background: #f7f5ef;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  --bg: #f7f5ef;
  --ink: #171717;
  --muted: #5f6368;
  --line: #d7d0c3;
  --panel: #ffffff;
  --accent: #0f766e;
  --accent-soft: #d7f4ef;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
}

button,
a {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-boot {
  min-height: 100vh;
  display: grid;
  place-content: center;
  gap: 10px;
  padding: 32px;
  text-align: center;
}

.desktop-frame {
  min-height: 100vh;
  background: var(--bg);
}

.topbar {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 18px;
  border-bottom: 1px solid var(--line);
  background: #fbfaf6;
  color: var(--muted);
}

.topbar strong {
  color: var(--ink);
  margin-right: 12px;
}

.workspace {
  display: grid;
  grid-template-columns: 86px 300px minmax(420px, 1fr) 320px;
  min-height: calc(100vh - 52px);
}

.sidebar {
  border-right: 1px solid var(--line);
  background: #202124;
  color: #f4f1ea;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-item {
  min-height: 48px;
  border: 0;
  border-radius: 7px;
  display: grid;
  place-items: center;
  gap: 3px;
  background: transparent;
  color: #e8e2d8;
  font-size: 11px;
  font-weight: 700;
}

.sidebar-item.active {
  background: #0f766e;
  color: #ffffff;
}

.panel,
.reader,
.context-panel {
  min-width: 0;
  padding: 18px;
  border-right: 1px solid var(--line);
}

.reader {
  background: var(--panel);
}

.context-panel {
  border-right: 0;
  background: #fbfaf6;
}

.panel-label,
.eyebrow {
  color: var(--muted);
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 760;
  margin-bottom: 12px;
}

h1,
h2,
p {
  letter-spacing: 0;
}

h2 {
  margin: 0 0 14px;
  font-size: 20px;
}

.lede {
  color: var(--muted);
  font-size: 16px;
  line-height: 1.55;
}

.stack {
  display: grid;
  gap: 10px;
}

.list-card,
.proof-card,
.composer {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 13px;
  background: #ffffff;
}

.list-card.unread {
  border-color: var(--accent);
  box-shadow: inset 3px 0 0 var(--accent);
}

.list-card strong,
.proof-card strong {
  display: block;
  margin-bottom: 5px;
}

.list-card span,
.list-card p,
.proof-card p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

.composer {
  min-height: 88px;
  margin-top: 14px;
  color: var(--muted);
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.actions button,
.reader > button {
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--ink);
  border-radius: 7px;
  padding: 8px 11px;
  font-weight: 700;
}

.actions .primary,
.primary {
  border-color: var(--accent);
  background: var(--accent);
  color: #ffffff;
}

.proof-state {
  display: inline-flex;
  margin-bottom: 8px;
  border-radius: 999px;
  padding: 5px 8px;
  background: var(--accent-soft);
  color: #064e45;
  font-size: 12px;
  font-weight: 760;
}

.proof-state.pending {
  background: #fff1d6;
  color: #7a4a00;
}

.proof-state.unverified {
  background: #f4dddd;
  color: #8a1f1f;
}

@media (max-width: 1100px) {
  .workspace {
    grid-template-columns: 80px minmax(260px, 360px) 1fr;
  }

  .context-panel {
    grid-column: 2 / 4;
    border-top: 1px solid var(--line);
  }
}

@media (max-width: 760px) {
  .workspace {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    overflow-x: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .sidebar-item {
    min-width: 72px;
  }

  .panel,
  .reader,
  .context-panel {
    grid-column: auto;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
}
```

- [ ] **Step 9: Run tests and build**

Run:

```powershell
npm test -- src/components/AppShell.test.tsx src/app/FreexsterApp.test.tsx
npm run build
```

Expected: all tests pass and Vite builds.

- [ ] **Step 10: Commit**

```powershell
git add src/app src/components src/styles.css
git commit -m "feat: add desktop app shell"
```

## Task 6: Homepage And Public Trust Copy

**Files:**
- Create: `src/components/Homepage.tsx`
- Create: `src/components/Homepage.test.tsx`
- Modify: `src/app/FreexsterApp.tsx`

- [ ] **Step 1: Write homepage tests**

Create `src/components/Homepage.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Homepage } from "./Homepage";

describe("Homepage", () => {
  it("explains download-first private messaging and public channel reading", () => {
    render(<Homepage />);

    expect(screen.getByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(screen.getByText("Download the desktop app for private SimpleX-backed inbox features.")).toBeInTheDocument();
    expect(screen.getByText("Read curated public topic channels and verify registry proofs on the web.")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests and confirm homepage is missing**

Run:

```powershell
npm test -- src/components/Homepage.test.tsx
```

Expected: fails because `Homepage` does not exist.

- [ ] **Step 3: Implement the homepage**

Create `src/components/Homepage.tsx`:

```tsx
export function Homepage() {
  return (
    <main className="homepage">
      <section className="homepage-hero">
        <p className="eyebrow">Working-title public good communications project</p>
        <h1>Freexster</h1>
        <p className="lede">Private inbox + public topic channels + trust registry.</p>
        <div className="homepage-actions">
          <a className="button primary" href="#downloads">Desktop download</a>
          <a className="button" href="#channels">Browse public channels</a>
        </div>
      </section>
      <section className="homepage-grid" id="downloads">
        <article>
          <h2>Private inbox</h2>
          <p>Download the desktop app for private SimpleX-backed inbox features.</p>
        </article>
        <article id="channels">
          <h2>Public channels</h2>
          <p>Read curated public topic channels and verify registry proofs on the web.</p>
        </article>
        <article>
          <h2>Trust registry</h2>
          <p>Freexster uses ICP canisters for identity, stewardship, and certified public data.</p>
        </article>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Route `?surface=home` to the homepage**

Modify `src/app/FreexsterApp.tsx` so it starts with:

```tsx
import { useMemo } from "react";
import { createMockFreexsterClient } from "../adapters/mockFreexsterClient";
import { AppShell } from "../components/AppShell";
import { Homepage } from "../components/Homepage";
import { useFreexsterData } from "./useFreexsterData";

export function FreexsterApp() {
  const surface = new URLSearchParams(window.location.search).get("surface");
  const client = useMemo(() => createMockFreexsterClient(), []);
  const data = useFreexsterData(client);

  if (surface === "home") {
    return <Homepage />;
  }

  if (data.status === "loading") {
    return <main className="app-boot">Loading Freexster...</main>;
  }

  if (data.status === "error" || !data.state) {
    return <main className="app-boot">Freexster could not load: {data.error}</main>;
  }

  return (
    <AppShell
      state={data.state}
      onSurfaceChange={data.setActiveSurface}
      onSubmitChannelRequest={async (input) => {
        await data.submitChannelRequest(input);
      }}
    />
  );
}
```

- [ ] **Step 5: Add homepage CSS**

Append to `src/styles.css`:

```css
.homepage {
  min-height: 100vh;
  padding: 42px 24px 64px;
  max-width: 1120px;
  margin: 0 auto;
}

.homepage-hero {
  min-height: 52vh;
  display: grid;
  align-content: center;
  gap: 14px;
}

.homepage-hero h1 {
  margin: 0;
  font-size: 64px;
  letter-spacing: 0;
}

.homepage-actions,
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d7d0c3;
  border-radius: 7px;
  padding: 10px 13px;
  color: #171717;
  text-decoration: none;
  font-weight: 700;
}

.homepage-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.homepage-grid article {
  background: #ffffff;
  border: 1px solid #d7d0c3;
  border-radius: 8px;
  padding: 18px;
}
```

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm test -- src/components/Homepage.test.tsx src/app/FreexsterApp.test.tsx
npm run build
```

Expected: all tests pass and build succeeds.

- [ ] **Step 7: Commit**

```powershell
git add src/app/FreexsterApp.tsx src/components/Homepage.tsx src/components/Homepage.test.tsx src/styles.css
git commit -m "feat: add Freexster homepage surface"
```

## Task 7: Tauri Desktop Wrapper And Native Status Command

**Files:**
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/build.rs`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/capabilities/default.json`
- Create: `src-tauri/src/main.rs`
- Create: `src-tauri/src/lib.rs`
- Create: `src/adapters/nativeStatus.ts`
- Modify: `src/adapters/mockFreexsterClient.ts`

- [ ] **Step 1: Create Tauri Rust project files**

Create `src-tauri/Cargo.toml`:

```toml
[package]
name = "freexster"
version = "0.1.0"
description = "Freexster desktop shell"
authors = ["General Magick Industries"]
edition = "2021"

[lib]
name = "freexster_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tauri = { version = "2", features = [] }
```

Create `src-tauri/build.rs`:

```rust
fn main() {
    tauri_build::build()
}
```

Create `src-tauri/tauri.conf.json`:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Freexster",
  "version": "0.1.0",
  "identifier": "com.nuosmagicko.freexster",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:5173",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "Freexster",
        "width": 1280,
        "height": 820,
        "minWidth": 960,
        "minHeight": 640
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": []
  }
}
```

Create `src-tauri/capabilities/default.json`:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default permissions for the Freexster desktop shell.",
  "windows": ["main"],
  "permissions": ["core:default"]
}
```

Create `src-tauri/src/main.rs`:

```rust
fn main() {
    freexster_lib::run()
}
```

Create `src-tauri/src/lib.rs`:

```rust
#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct FreexsterNativeStatus {
    runtime: &'static str,
    simplex_runner: &'static str,
    registry: &'static str,
}

#[tauri::command]
fn freexster_status() -> FreexsterNativeStatus {
    FreexsterNativeStatus {
        runtime: "tauri",
        simplex_runner: "mock-connected",
        registry: "mock",
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![freexster_status])
        .run(tauri::generate_context!())
        .expect("error while running Freexster");
}
```

- [ ] **Step 2: Add native status adapter**

Create `src/adapters/nativeStatus.ts`:

```ts
import type { NativeStatus } from "../domain/types";

export async function loadNativeStatus(): Promise<NativeStatus> {
  if (!("__TAURI_INTERNALS__" in window)) {
    return {
      runtime: "web",
      simplexRunner: "mock-connected",
      registry: "mock",
    };
  }

  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<NativeStatus>("freexster_status");
}
```

- [ ] **Step 3: Use native status in mock client**

Modify `src/adapters/mockFreexsterClient.ts`:

```ts
import type { ChannelRequest, FreexsterState } from "../domain/types";
import { demoState } from "../domain/fixtures";
import type { ChannelRequestInput, FreexsterClient } from "./freexsterClient";
import { loadNativeStatus } from "./nativeStatus";

function cloneState(): FreexsterState {
  return structuredClone(demoState);
}

export function createMockFreexsterClient(): FreexsterClient {
  let state = cloneState();

  return {
    async loadState() {
      const nativeStatus = await loadNativeStatus();
      state = { ...state, nativeStatus };
      return structuredClone(state);
    },
    async loadNativeStatus() {
      return loadNativeStatus();
    },
    async submitChannelRequest(input: ChannelRequestInput): Promise<ChannelRequest> {
      const request: ChannelRequest = {
        id: `request-${input.requestedSlug}`,
        requestedSlug: input.requestedSlug,
        requestedBy: input.requestedBy,
        rationale: input.rationale,
        status: "submitted",
      };

      state = {
        ...state,
        channelRequests: [request, ...state.channelRequests],
      };

      return structuredClone(request);
    },
  };
}
```

- [ ] **Step 4: Verify frontend tests and Rust build**

Run:

```powershell
npm test
cargo check --manifest-path src-tauri/Cargo.toml
```

Expected: frontend tests pass and Cargo reports a successful check.

- [ ] **Step 5: Verify Tauri dev starts**

Run:

```powershell
npm run tauri dev
```

Expected: a Freexster desktop window opens with the app shell. Close the window after confirming it opens.

- [ ] **Step 6: Commit**

```powershell
git add src-tauri src/adapters/nativeStatus.ts src/adapters/mockFreexsterClient.ts
git commit -m "feat: add Tauri desktop wrapper"
```

## Task 8: Boundary Documentation And Verification

**Files:**
- Create: `docs/architecture/foundation-boundaries.md`
- Modify: `README.md`

- [ ] **Step 1: Create boundary documentation**

Create `docs/architecture/foundation-boundaries.md`:

```md
# Freexster Foundation Boundaries

This document records the implementation boundary of the first Freexster vertical slice.

## Real In This Slice

- React desktop-first app shell.
- Homepage surface for download and public trust copy.
- Deterministic domain model and fixtures.
- Mock Freexster client with adapter interfaces.
- Tauri desktop wrapper.
- Native status command returning mocked desktop status.
- Channel request flow that records requests without creating public channels.

## Mocked In This Slice

- SimpleX runner connection.
- ICP registry.
- Certified public reads.
- Public channel canisters.
- Confidential subnet deployment.
- vetKeys.
- Agent execution.

## Product Boundaries Preserved

- Private messages are represented as local SimpleX-backed threads.
- Public channels are curated and approved.
- Channel requests do not create channels automatically.
- Agents are visible in the information architecture but disabled for execution.
- The trust panel separates SimpleX route status, registry status, and channel stewardship.

## Next Implementation Plans

- SimpleX local runner proof of concept.
- ICP registry canister prototype.
- ICP public channel canister prototype.
- Certified variable verification in the frontend.
- vetKeys encrypted settings prototype.
- Desktop installer and update pipeline.
```

- [ ] **Step 2: Update README**

Modify `README.md` to add:

```md
## First Implementation Slice

The first implementation slice builds a tested React/Tauri foundation with mocked SimpleX and ICP adapters. It is not yet a production private messenger or deployed ICP dapp.

Run locally:

```powershell
npm install
npm test
npm run build
npm run tauri dev
```

See `docs/architecture/foundation-boundaries.md` for what is real versus mocked in this slice.
```

- [ ] **Step 3: Run all checks**

Run:

```powershell
npm test
npm run build
cargo check --manifest-path src-tauri/Cargo.toml
git diff --check
```

Expected: all tests/checks pass and `git diff --check` returns no output.

- [ ] **Step 4: Commit**

```powershell
git add README.md docs/architecture/foundation-boundaries.md
git commit -m "docs: document foundation boundaries"
```

## Task 9: Push And Handoff

**Files:**
- No new files.

- [ ] **Step 1: Review local history**

Run:

```powershell
git log --oneline --decorate -8
git status --short --branch
```

Expected: the branch is clean and contains the implementation commits from Tasks 1-8.

- [ ] **Step 2: Push**

Run:

```powershell
git push
```

Expected: `main` pushes to `origin/main`.

- [ ] **Step 3: Final manual smoke**

Run:

```powershell
npm run dev
```

Open `http://localhost:5173/` and verify:

- Inbox is the first screen.
- Channels button switches to approved topic channels.
- Request a channel adds a submitted channel request.
- Agents surface is visible but not executing agents.
- `http://localhost:5173/?surface=home` shows the homepage.

Stop the dev server with `Ctrl+C`.

- [ ] **Step 4: Report**

Report:

- local repo path;
- GitHub URL;
- latest commit hash;
- checks run and their pass/fail status;
- which features are mocked;
- recommended next implementation plan.

## Plan Self-Review Notes

Spec coverage:

- Desktop app shell: Tasks 1, 5, 7.
- Private inbox UX: Tasks 2, 5.
- Curated public topic channels: Tasks 2, 3, 5.
- Channel requests: Tasks 3, 5.
- Homepage/download concept: Task 6.
- Trust panel and registry framing: Tasks 2, 5, 8.
- Agents designed but execution disabled: Tasks 2, 5, 8.
- Honest boundary documentation: Task 8.

Known gaps intentionally assigned to follow-on plans:

- real SimpleX runner integration;
- real ICP canisters;
- canister security implementation;
- certified variable verification;
- vetKeys encryption;
- confidential subnet deployment;
- installer packaging and signing.

Placeholder scan:

- The placeholder scan passed with no unresolved work markers.
- Every code-producing task includes concrete files and code or exact command expectations.
