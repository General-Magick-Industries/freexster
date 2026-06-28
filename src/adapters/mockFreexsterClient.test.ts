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
