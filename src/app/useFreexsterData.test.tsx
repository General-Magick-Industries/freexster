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
