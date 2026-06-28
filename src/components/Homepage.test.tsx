import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Homepage } from "./Homepage";

describe("Homepage", () => {
  it("explains download-first private messaging and public channel reading", () => {
    render(<Homepage />);

    expect(screen.getByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(screen.getByText("Download the desktop app for private SimpleX-backed inbox features.")).toBeInTheDocument();
    expect(screen.getByText("Read curated public topic channels and verify registry proofs on the web.")).toBeInTheDocument();
    expect(screen.getByText("The trust registry is designed for ICP canisters, stewardship records, and certified public data.")).toBeInTheDocument();
  });
});
