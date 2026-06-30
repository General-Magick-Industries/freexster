import type { SimplexRunnerStatus } from "../domain/types";

const SIMPLEX_SECURITY_BOUNDARY =
  "SimpleX CLI WebSocket is unauthenticated; Freexster only probes 127.0.0.1.";

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
      securityBoundary: SIMPLEX_SECURITY_BOUNDARY,
    };
  }

  return invoke<SimplexRunnerStatus>("simplex_runner_status");
}
