// Regression: ISSUE-001 — the recipient/message/sender card on the reveal
// page (/b/[token]) rendered as an empty white box (padding + shadow, no
// content) whenever a bouquet was sent with no recipient, message, or
// sender filled in — a valid, common flow since those fields are optional.
// Found by /qa on 2026-08-31
// Report: .gstack/qa-reports/qa-report-localhost-2026-08-31.md
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RevealExperience } from "./RevealExperience";
import { createEmptyBouquet } from "@/lib/bouquet/types";

async function openGift() {
  const openButton = screen.getByRole("button", { name: /open your gift/i });
  openButton.click();
  await waitFor(() => screen.getByText("Bloomly"), { timeout: 2000 });
}

describe("RevealExperience card visibility", () => {
  it("renders no card at all when recipient, message, and sender are empty", async () => {
    const bouquet = { ...createEmptyBouquet(), recipient: "", message: "", sender: "" };
    render(<RevealExperience bouquet={bouquet} />);

    await openGift();

    expect(screen.queryByText(/^For /)).not.toBeInTheDocument();
    expect(screen.queryByText(/Made with love/)).not.toBeInTheDocument();
    // No empty card wrapper left behind either.
    const emptyCards = document.querySelectorAll(".rounded-2xl.px-6.py-5");
    expect(emptyCards.length).toBe(0);
  });

  it("renders the card with recipient and message when they are set", async () => {
    const bouquet = { ...createEmptyBouquet(), recipient: "Alex", message: "Hello there", sender: "" };
    render(<RevealExperience bouquet={bouquet} />);

    await openGift();

    expect(screen.getByText("For Alex")).toBeInTheDocument();
    expect(screen.getByText(/Hello there/)).toBeInTheDocument();
  });
});
