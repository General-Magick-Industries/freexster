import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createMockFreexsterClient } from "../adapters/mockFreexsterClient";
import { useFreexsterData } from "./useFreexsterData";

vi.mock("../adapters/simplexRunner", () => ({
  loadSimplexRunnerStatus: vi.fn(async () => ({
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
  })),
}));

describe("useFreexsterData", () => {
  it("loads state and switches surfaces", async () => {
    const client = createMockFreexsterClient();
    const { result } = renderHook(() => useFreexsterData(client));

    await waitFor(() => expect(result.current.status).toBe("ready"));

    await act(() => {
      result.current.setActiveSurface("channels");
    });

    expect(result.current.state?.activeSurface).toBe("channels");
  });

  it("loads SimpleX runner status into app state", async () => {
    const client = createMockFreexsterClient();
    const { result } = renderHook(() => useFreexsterData(client));

    await waitFor(() => expect(result.current.status).toBe("ready"));

    expect(result.current.state).toMatchObject({
      simplexRunner: {
        runtime: "web",
        state: "desktop-required",
        canConnect: false,
        webSocketUrl: "ws://127.0.0.1:5225",
      },
    });
  });

  it("adds a submitted channel request", async () => {
    const client = createMockFreexsterClient();
    const { result } = renderHook(() => useFreexsterData(client));

    await waitFor(() => expect(result.current.status).toBe("ready"));

    await act(async () => {
      await result.current.submitChannelRequest({
        requestedSlug: "trust-research",
        requestedBy: "Mark",
        rationale: "A curated channel for security and trust research.",
      });
    });

    expect(result.current.state?.channelRequests[0].requestedSlug).toBe("trust-research");
    expect(result.current.state?.channelRequests[0].status).toBe("submitted");
  });
});
