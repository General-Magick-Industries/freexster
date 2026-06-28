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
