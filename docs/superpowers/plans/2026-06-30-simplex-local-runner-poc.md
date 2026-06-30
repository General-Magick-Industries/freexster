# SimpleX Local Runner POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a safe first desktop bridge that shows whether Freexster can see a local SimpleX CLI WebSocket runner on `127.0.0.1`.

**Architecture:** The browser app gets runner status through a frontend adapter. In web mode the adapter returns a desktop-required fallback; in Tauri mode it invokes a narrowly-permitted Rust command that reads local environment configuration and probes only `127.0.0.1:<port>`. This slice does not start processes, read SimpleX messages, send SimpleX commands, or open a remote WebSocket.

**Tech Stack:** React 19, Vite 6, Vitest, Tauri 2, Rust std library, SimpleX Chat CLI local WebSocket API.

## Global Constraints

- Work on branch `codex/simplex-runner-poc` in `C:\Users\Mark\Documents\New project\freexster\.worktrees\freexster-v1-foundation`.
- Use official SimpleX docs as the integration source: `https://simplex.chat/docs/cli.html` and `https://github.com/simplex-chat/simplex-chat/blob/stable/bots/README.md`.
- Only probe `127.0.0.1`; never accept a user-supplied host in this slice.
- Treat the SimpleX CLI WebSocket API as unauthenticated local infrastructure and say so in docs and UI.
- Do not launch or kill `simplex-chat` from Freexster in this slice.
- Do not add native file-system write permissions.
- Follow TDD for production behavior: write failing test, watch it fail, implement, watch it pass.

---

## File Structure

- Create `src/adapters/simplexRunner.ts`: typed frontend adapter for runner status.
- Create `src/adapters/simplexRunner.test.ts`: Vitest coverage for web fallback and Tauri invoke path.
- Create `src/components/SettingsPanel.tsx`: desktop settings surface showing runner status, local-only boundary, and setup command.
- Create `src/components/SettingsPanel.test.tsx`: UI coverage for configured, unconfigured, and listening states.
- Modify `src/domain/types.ts`: add `SimplexRunnerStatus` and expand `NativeStatus.simplexRunner` only if needed by topbar summary.
- Modify `src/components/AppShell.tsx`: route the settings surface to `SettingsPanel`.
- Create `src-tauri/src/simplex_runner.rs`: Rust status model, env parsing, localhost TCP probe, and Tauri command.
- Modify `src-tauri/src/lib.rs`: register the new command and use the runner summary in `freexster_status`.
- Create `src-tauri/permissions/simplex-runner.toml`: allow only `simplex_runner_status`.
- Modify `src-tauri/capabilities/default.json`: include the new narrow permission.
- Create `docs/architecture/simplex-runner-poc.md`: document configuration, security boundary, and next slice.
- Modify `docs/architecture/foundation-boundaries.md` and `README.md`: move SimpleX runner POC from mocked to real-but-limited.

---

### Task 1: Frontend Runner Adapter

**Files:**
- Create: `src/adapters/simplexRunner.ts`
- Create: `src/adapters/simplexRunner.test.ts`
- Modify: `src/domain/types.ts`

**Interfaces:**
- Produces:
  - `type SimplexRunnerState = "desktop-required" | "not-configured" | "missing-binary" | "configured-not-running" | "listening" | "error"`
  - `type SimplexRunnerStatus = { runtime: "web" | "tauri"; host: "127.0.0.1"; port: number; webSocketUrl: string; state: SimplexRunnerState; configured: boolean; canConnect: boolean; binaryPath: string | null; lastError: string | null; securityBoundary: string }`
  - `loadSimplexRunnerStatus(): Promise<SimplexRunnerStatus>`

- [ ] **Step 1: Write the failing adapter tests**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const invokeMock = vi.fn();
const isTauriMock = vi.fn();

vi.mock("@tauri-apps/api/core", () => ({
  invoke: invokeMock,
  isTauri: isTauriMock,
}));

describe("loadSimplexRunnerStatus", () => {
  beforeEach(() => {
    invokeMock.mockReset();
    isTauriMock.mockReset();
    vi.resetModules();
  });

  it("returns a desktop-required fallback outside Tauri", async () => {
    isTauriMock.mockReturnValue(false);
    const { loadSimplexRunnerStatus } = await import("./simplexRunner");
    await expect(loadSimplexRunnerStatus()).resolves.toMatchObject({
      runtime: "web",
      host: "127.0.0.1",
      port: 5225,
      webSocketUrl: "ws://127.0.0.1:5225",
      state: "desktop-required",
      configured: false,
      canConnect: false,
    });
    expect(invokeMock).not.toHaveBeenCalled();
  });

  it("invokes simplex_runner_status inside Tauri", async () => {
    isTauriMock.mockReturnValue(true);
    invokeMock.mockResolvedValue({
      runtime: "tauri",
      host: "127.0.0.1",
      port: 5225,
      webSocketUrl: "ws://127.0.0.1:5225",
      state: "listening",
      configured: true,
      canConnect: true,
      binaryPath: "C:\\Tools\\simplex-chat.exe",
      lastError: null,
      securityBoundary: "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1.",
    });
    const { loadSimplexRunnerStatus } = await import("./simplexRunner");
    await expect(loadSimplexRunnerStatus()).resolves.toMatchObject({
      runtime: "tauri",
      state: "listening",
      canConnect: true,
    });
    expect(invokeMock).toHaveBeenCalledWith("simplex_runner_status");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/adapters/simplexRunner.test.ts`

Expected: FAIL because `src/adapters/simplexRunner.ts` does not exist.

- [ ] **Step 3: Implement domain types and adapter**

```ts
export type SimplexRunnerState =
  | "desktop-required"
  | "not-configured"
  | "missing-binary"
  | "configured-not-running"
  | "listening"
  | "error";

export type SimplexRunnerStatus = {
  runtime: "web" | "tauri";
  host: "127.0.0.1";
  port: number;
  webSocketUrl: string;
  state: SimplexRunnerState;
  configured: boolean;
  canConnect: boolean;
  binaryPath: string | null;
  lastError: string | null;
  securityBoundary: string;
};
```

```ts
import type { SimplexRunnerStatus } from "../domain/types";

export async function loadSimplexRunnerStatus(): Promise<SimplexRunnerStatus> {
  const { invoke, isTauri } = await import("@tauri-apps/api/core");

  if (!isTauri()) {
    return {
      runtime: "web",
      host: "127.0.0.1",
      port: 5225,
      webSocketUrl: "ws://127.0.0.1:5225",
      state: "desktop-required",
      configured: false,
      canConnect: false,
      binaryPath: null,
      lastError: "SimpleX runner status is available in the Freexster desktop app.",
      securityBoundary: "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1.",
    };
  }

  return invoke<SimplexRunnerStatus>("simplex_runner_status");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/adapters/simplexRunner.test.ts`

Expected: PASS.

---

### Task 2: Native Localhost Runner Status

**Files:**
- Create: `src-tauri/src/simplex_runner.rs`
- Modify: `src-tauri/src/lib.rs`
- Create: `src-tauri/permissions/simplex-runner.toml`
- Modify: `src-tauri/capabilities/default.json`

**Interfaces:**
- Consumes: `SimplexRunnerStatus` JSON shape from Task 1.
- Produces:
  - Tauri command `simplex_runner_status`.
  - Rust pure function `status_from_config(config: SimplexRunnerConfig, connector: impl Fn(&str, u16) -> bool) -> SimplexRunnerStatus`.

- [ ] **Step 1: Write failing Rust tests**

Add this test module to `src-tauri/src/simplex_runner.rs` before implementing the functions:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reports_not_configured_when_no_binary_and_port_closed() {
        let status = status_from_config(
            SimplexRunnerConfig {
                binary_path: None,
                port: 5225,
            },
            |_, _| false,
        );

        assert_eq!(status.state, "not-configured");
        assert!(!status.configured);
        assert!(!status.can_connect);
        assert_eq!(status.web_socket_url, "ws://127.0.0.1:5225");
    }

    #[test]
    fn reports_listening_when_localhost_port_accepts_connections() {
        let status = status_from_config(
            SimplexRunnerConfig {
                binary_path: Some("simplex-chat".to_string()),
                port: 5225,
            },
            |host, port| host == "127.0.0.1" && port == 5225,
        );

        assert_eq!(status.state, "listening");
        assert!(status.configured);
        assert!(status.can_connect);
    }

    #[test]
    fn clamps_invalid_ports_to_default() {
        let config = SimplexRunnerConfig::from_env_values(None, Some("70000".to_string()));

        assert_eq!(config.port, 5225);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cargo test --manifest-path src-tauri/Cargo.toml simplex_runner`

Expected: FAIL because `simplex_runner` is not registered or functions are missing.

- [ ] **Step 3: Implement native module**

Implement:

```rust
use std::net::{TcpStream, ToSocketAddrs};
use std::path::Path;
use std::time::Duration;

const LOCALHOST: &str = "127.0.0.1";
const DEFAULT_PORT: u16 = 5225;
const SECURITY_BOUNDARY: &str =
    "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1.";

#[derive(Debug, Clone)]
pub struct SimplexRunnerConfig {
    pub binary_path: Option<String>,
    pub port: u16,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SimplexRunnerStatus {
    pub runtime: &'static str,
    pub host: &'static str,
    pub port: u16,
    pub web_socket_url: String,
    pub state: &'static str,
    pub configured: bool,
    pub can_connect: bool,
    pub binary_path: Option<String>,
    pub last_error: Option<String>,
    pub security_boundary: &'static str,
}
```

Use `FREEXSTER_SIMPLEX_CHAT_PATH` and `FREEXSTER_SIMPLEX_CHAT_PORT`. If a binary path is set and does not exist as a filesystem path, report `missing-binary`. If no path is configured but the port is listening, report `listening`. If a path exists but the port is closed, report `configured-not-running`.

- [ ] **Step 4: Register command and permission**

Update `src-tauri/src/lib.rs`:

```rust
mod simplex_runner;

#[tauri::command]
fn freexster_status() -> FreexsterNativeStatus {
    let runner = simplex_runner::simplex_runner_status();
    FreexsterNativeStatus {
        runtime: "tauri",
        simplex_runner: runner.state,
        registry: "mock",
    }
}

.invoke_handler(tauri::generate_handler![
    freexster_status,
    simplex_runner::simplex_runner_status
])
```

Create `src-tauri/permissions/simplex-runner.toml`:

```toml
[[permission]]
identifier = "allow-simplex-runner-status"
description = "Allows Freexster to inspect local-only SimpleX runner readiness."
commands.allow = ["simplex_runner_status"]
```

Update `src-tauri/capabilities/default.json`:

```json
"permissions": ["allow-freexster-status", "allow-simplex-runner-status"]
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cargo test --manifest-path src-tauri/Cargo.toml simplex_runner`

Expected: PASS.

---

### Task 3: Settings UI

**Files:**
- Create: `src/components/SettingsPanel.tsx`
- Create: `src/components/SettingsPanel.test.tsx`
- Modify: `src/components/AppShell.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `SimplexRunnerStatus`
- Produces: settings surface text and status classes for desktop setup.

- [ ] **Step 1: Write failing UI tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SimplexRunnerStatus } from "../domain/types";
import { SettingsPanel } from "./SettingsPanel";

const baseStatus: SimplexRunnerStatus = {
  runtime: "tauri",
  host: "127.0.0.1",
  port: 5225,
  webSocketUrl: "ws://127.0.0.1:5225",
  state: "not-configured",
  configured: false,
  canConnect: false,
  binaryPath: null,
  lastError: null,
  securityBoundary: "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1.",
};

describe("SettingsPanel", () => {
  it("shows the local-only SimpleX setup command when not configured", () => {
    render(<SettingsPanel simplexRunner={baseStatus} />);
    expect(screen.getByText("SimpleX runner")).toBeInTheDocument();
    expect(screen.getByText("not-configured")).toBeInTheDocument();
    expect(screen.getByText("simplex-chat -p 5225")).toBeInTheDocument();
  });

  it("shows connected status when the local runner is listening", () => {
    render(<SettingsPanel simplexRunner={{ ...baseStatus, state: "listening", configured: true, canConnect: true }} />);
    expect(screen.getByText("listening")).toBeInTheDocument();
    expect(screen.getByText("ws://127.0.0.1:5225")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/components/SettingsPanel.test.tsx`

Expected: FAIL because `SettingsPanel` does not exist.

- [ ] **Step 3: Implement settings surface**

`SettingsPanel` renders:

```tsx
export function SettingsPanel({ simplexRunner }: { simplexRunner: SimplexRunnerStatus }) {
  return (
    <>
      <aside className="panel settings-summary">
        <div className="panel-label">Settings</div>
        <h2>SimpleX runner</h2>
        <span className={`runner-state ${simplexRunner.canConnect ? "ready" : "pending"}`}>
          {simplexRunner.state}
        </span>
        <p>{simplexRunner.securityBoundary}</p>
      </aside>
      <section className="reader settings-reader">
        <div className="panel-label">Desktop bridge</div>
        <p className="lede">Freexster uses your local SimpleX runner for private inbox transport.</p>
        <dl className="status-grid">
          <div><dt>Runner URL</dt><dd>{simplexRunner.webSocketUrl}</dd></div>
          <div><dt>Binary</dt><dd>{simplexRunner.binaryPath ?? "Set FREEXSTER_SIMPLEX_CHAT_PATH"}</dd></div>
        </dl>
        <code className="command-chip">simplex-chat -p {simplexRunner.port}</code>
      </section>
    </>
  );
}
```

Update `AppShell` to pass `state.simplexRunner` into `SettingsPanel` once Task 4 adds it to app state.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/components/SettingsPanel.test.tsx`

Expected: PASS.

---

### Task 4: App State Integration

**Files:**
- Modify: `src/domain/types.ts`
- Modify: `src/domain/fixtures.ts`
- Modify: `src/app/useFreexsterData.ts`
- Modify: `src/app/useFreexsterData.test.tsx`
- Modify: `src/components/AppShell.tsx`
- Modify: `src/components/AppShell.test.tsx`

**Interfaces:**
- Consumes: `loadSimplexRunnerStatus`
- Produces: `FreexsterState.simplexRunner: SimplexRunnerStatus`

- [ ] **Step 1: Write failing app-state test**

Extend `src/app/useFreexsterData.test.tsx` to mock `loadSimplexRunnerStatus` and assert the hook stores the runner details.

Expected object:

```ts
{
  runtime: "web",
  host: "127.0.0.1",
  port: 5225,
  webSocketUrl: "ws://127.0.0.1:5225",
  state: "desktop-required",
  configured: false,
  canConnect: false,
  binaryPath: null,
  lastError: "SimpleX runner status is available in the Freexster desktop app.",
  securityBoundary: "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1."
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/app/useFreexsterData.test.tsx`

Expected: FAIL because `FreexsterState` has no `simplexRunner` field.

- [ ] **Step 3: Implement app-state integration**

Add `simplexRunner: SimplexRunnerStatus` to `FreexsterState`, fixture data, and hook loading. Keep `nativeStatus.simplexRunner` as the compact topbar summary.

- [ ] **Step 4: Update AppShell settings route**

When `state.activeSurface === "settings"`, render:

```tsx
<SettingsPanel simplexRunner={state.simplexRunner} />
```

Update topbar expectation from `"mock-connected / mock"` to the new state in tests as needed.

- [ ] **Step 5: Run app tests**

Run: `npm test -- src/app/useFreexsterData.test.tsx src/components/AppShell.test.tsx`

Expected: PASS.

---

### Task 5: Documentation and Verification

**Files:**
- Create: `docs/architecture/simplex-runner-poc.md`
- Modify: `docs/architecture/foundation-boundaries.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: implementation behavior from Tasks 1-4.
- Produces: user-facing and maintainer-facing setup boundary.

- [ ] **Step 1: Document the runner POC**

`docs/architecture/simplex-runner-poc.md` must include:

```md
# SimpleX Runner POC

Freexster's first SimpleX integration only checks readiness for a local SimpleX CLI runner.

## Configuration

- `FREEXSTER_SIMPLEX_CHAT_PATH`: optional path to `simplex-chat` or `simplex-chat.exe`.
- `FREEXSTER_SIMPLEX_CHAT_PORT`: optional port, default `5225`.
- Start SimpleX separately with `simplex-chat -p 5225`.

## Security Boundary

The SimpleX CLI WebSocket API is treated as unauthenticated local infrastructure. Freexster only probes `127.0.0.1` and does not accept a remote host.

## Out Of Scope

- Sending or reading messages.
- Starting or killing SimpleX processes.
- Managing SimpleX profiles or databases.
- Exposing SimpleX APIs to the web build.
```

- [ ] **Step 2: Update foundation docs**

Move “SimpleX runner connection” from fully mocked to “local readiness probe only.” Keep “SimpleX messaging bridge” mocked.

- [ ] **Step 3: Full verification**

Run:

```powershell
npm test
npm run build
cargo test --manifest-path src-tauri\Cargo.toml simplex_runner
cargo check --manifest-path src-tauri\Cargo.toml
git diff --check
```

Expected: all pass with no warnings requiring code changes.

- [ ] **Step 4: Commit and push**

Run:

```powershell
git status --short
git add src docs README.md src-tauri
git commit -m "feat: add SimpleX runner readiness POC"
git push -u origin codex/simplex-runner-poc
```

Expected: branch pushed for review as a stacked follow-up to the foundation PR.

---

## Self-Review

- Spec coverage: This plan covers the first safe SimpleX desktop runner step without prematurely building the private message bridge.
- Security coverage: The plan rejects remote hosts, avoids process launching, and explicitly documents the unauthenticated local WebSocket boundary.
- Test coverage: Frontend adapter, UI rendering, app state, and Rust status classification are all tested before implementation.
