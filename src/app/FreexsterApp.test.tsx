import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FreexsterApp } from "./FreexsterApp";

describe("FreexsterApp", () => {
  it("renders the approved working title and v1 positioning", async () => {
    render(<FreexsterApp />);

    expect(await screen.findByRole("heading", { name: "Freexster" })).toBeInTheDocument();
    expect(screen.getByText("Private inbox + public topic channels + trust registry")).toBeInTheDocument();
  });
});
