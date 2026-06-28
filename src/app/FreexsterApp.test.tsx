import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FreexsterApp } from "./FreexsterApp";

describe("FreexsterApp", () => {
  it("shows Homepage when ?surface=home", async () => {
    window.history.replaceState({}, "", "/?surface=home");

    render(<FreexsterApp />);

    expect(await screen.findByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(
      await screen.findByText("The first desktop build will provide a SimpleX-backed private inbox experience."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Private inbox + public topic channels + trust registry"),
    ).not.toBeInTheDocument();
  });

  it("renders app shell by default", async () => {
    window.history.replaceState({}, "", "/");

    render(<FreexsterApp />);

    expect(await screen.findByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(
      await screen.findByText("Private inbox + public topic channels + trust registry"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("This web surface is meant for browsing curated public topic channels and planned proof views."),
    ).not.toBeInTheDocument();
  });
});
