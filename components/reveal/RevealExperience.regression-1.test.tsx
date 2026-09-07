// Regression: ISSUE-001 — the recipient/message/sender card on the reveal
// page (/b/[token]) rendered as an empty white box (padding + shadow, no
// content) whenever a bouquet was sent with no recipient, message, or
// sender filled in — a valid, common flow since those fields are optional.
// Found by /qa on 2026-08-31
// Report: .gstack/qa-reports/qa-report-localhost-2026-08-31.md
//
// The story now travels as a letter in an envelope tucked into the bouquet
// (BouquetEnvelope). It must stay hidden when there is nothing to deliver,
// and open into the full letter when content is present.
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RevealExperience } from "./RevealExperience";
import { createEmptyBouquet } from "@/lib/bouquet/types";

async function openGift() {
  const openButton = screen.getByRole("button", { name: /open your gift/i });
  openButton.click();
  await waitFor(() => screen.getByText("BloomStory"), { timeout: 2000 });
}

describe("RevealExperience envelope in the bouquet", () => {
  it("renders no envelope when recipient, message, and sender are empty", async () => {
    const bouquet = { ...createEmptyBouquet(), recipient: "", title: "", message: "", sender: "" };
    render(<RevealExperience bouquet={bouquet} />);

    await openGift();

    expect(screen.queryByRole("button", { name: /open the envelope/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^For /)).not.toBeInTheDocument();
  });

  it("shakes an envelope in the bouquet that opens into the letter", async () => {
    const bouquet = { ...createEmptyBouquet(), recipient: "Alex", title: "For Alex", message: "Hello there", sender: "" };
    render(<RevealExperience bouquet={bouquet} />);

    await openGift();

    // The envelope borrows the recipient's name for its address.
    expect(screen.getAllByText("For Alex").length).toBeGreaterThan(0);
    const envelopeButton = screen.getByRole("button", { name: /open the envelope/i });

    envelopeButton.click();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /close the envelope/i })).toBeInTheDocument();
    });

    // The message becomes visible in the letter once the envelope is opened.
    expect(screen.getAllByText(/Hello there/).length).toBeGreaterThan(0);
  });
});