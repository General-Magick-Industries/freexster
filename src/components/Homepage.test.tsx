import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Homepage } from "./Homepage";

describe("Homepage", () => {
  it("explains download-first private messaging and public channel reading", () => {
    render(<Homepage />);

    expect(screen.getByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(
      screen.getByText("The first desktop build will provide a SimpleX-backed private inbox experience."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This web surface is meant for browsing curated public topic channels and planned proof views.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Early trust registry work is designed for ICP canisters, stewardship records, and certified public data."),
    ).toBeInTheDocument();
  });
});
