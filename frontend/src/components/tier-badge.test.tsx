import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TierBadge } from "./tier-badge";

describe("<TierBadge />", () => {
  it("renders the gold tier label", () => {
    render(<TierBadge tier="gold" />);
    expect(screen.getByText("طلایی")).toBeInTheDocument();
  });

  it("renders the silver tier label", () => {
    render(<TierBadge tier="silver" />);
    expect(screen.getByText("نقره‌ای")).toBeInTheDocument();
  });

  it("hides the label when showLabel is false", () => {
    render(<TierBadge tier="basic" showLabel={false} />);
    expect(screen.queryByText("پایه (رایگان)")).not.toBeInTheDocument();
  });
});
