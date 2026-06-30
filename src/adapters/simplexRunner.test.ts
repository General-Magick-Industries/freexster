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
