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
    expect(screen.getByText("Set FREEXSTER_SIMPLEX_CHAT_PATH")).toBeInTheDocument();
  });

  it("shows connected status when the local runner is listening", () => {
    render(<SettingsPanel simplexRunner={{ ...baseStatus, state: "listening", configured: true, canConnect: true }} />);

    expect(screen.getByText("listening")).toBeInTheDocument();
    expect(screen.getByText("ws://127.0.0.1:5225")).toBeInTheDocument();
  });
});
