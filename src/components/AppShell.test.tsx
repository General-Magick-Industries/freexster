import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { demoState } from "../domain/fixtures";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders inbox, active thread, and trust context", () => {
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
  });

  it("lets the user switch to channels", async () => {
    const user = userEvent.setup();
    let selected = demoState.activeSurface;

    render(
      <AppShell
        state={demoState}
        onSurfaceChange={(surface) => {
          selected = surface;
        }}
        onSubmitChannelRequest={async () => undefined}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Channels" }));

    expect(selected).toBe("channels");
  });
});
