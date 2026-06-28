import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { demoState } from "../domain/fixtures";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders inbox, active thread, trust context, and ASCII topbar status", () => {
    render(
      <AppShell
        state={demoState}
        onSurfaceChange={() => undefined}
        onSubmitChannelRequest={async () => undefined}
      />,
    );

    expect(screen.getByText("Priority letters")).toBeInTheDocument();
    expect(screen.getByText("SimpleX onboarding notes")).toBeInTheDocument();
    expect(screen.getByText("Trust and stewardship")).toBeInTheDocument();
    expect(screen.getByText("mock-connected / mock")).toBeInTheDocument();
  });

  it("renders the channels surface, marks the active nav item, and shows success feedback", async () => {
    const user = userEvent.setup();
    const submitChannelRequest = vi.fn(() => Promise.resolve());

    render(
      <AppShell
        state={{ ...demoState, activeSurface: "channels" }}
        onSurfaceChange={() => undefined}
        onSubmitChannelRequest={submitChannelRequest}
      />,
    );

    expect(screen.getByText("Topic channels")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Channels" })).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("button", { name: "Request a channel" }));

    await waitFor(() => {
      expect(submitChannelRequest).toHaveBeenCalledWith({
        requestedSlug: "robot-comms",
        requestedBy: "Mark",
        rationale: "A curated channel for future robot-to-robot communications design.",
      });
    });

    expect(await screen.findByText("Channel request submitted for review.")).toBeInTheDocument();
  });

  it("disables repeated channel requests while pending and recovers with error feedback", async () => {
    const user = userEvent.setup();
    let rejectRequest: ((error?: unknown) => void) | undefined;
    const submitChannelRequest = vi.fn(
      () =>
        new Promise<void>((_, reject) => {
          rejectRequest = reject;
        }),
    );

    render(
      <AppShell
        state={{ ...demoState, activeSurface: "channels" }}
        onSurfaceChange={() => undefined}
        onSubmitChannelRequest={submitChannelRequest}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Request a channel" }));

    expect(submitChannelRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Requesting..." })).toBeDisabled();
    expect(screen.getByText("Submitting channel request...")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Requesting..." }));
    expect(submitChannelRequest).toHaveBeenCalledTimes(1);

    rejectRequest?.(new Error("network"));

    expect(await screen.findByText("Channel request failed. Please try again.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Request a channel" })).toBeEnabled();
  });
});
