import { describe, expect, it } from "vitest";

import { formatDuration, formatNumber, formatToman, toFaDigits } from "./format";

describe("formatting", () => {
  it("converts Latin digits to Persian", () => {
    expect(toFaDigits("2026")).toBe("۲۰۲۶");
  });

  it("formats a duration as m:ss with Persian digits", () => {
    expect(formatDuration(125)).toBe("۲:۰۵");
    expect(formatDuration(5)).toBe("۰:۰۵");
  });

  it("appends the Toman suffix", () => {
    expect(formatToman(79000)).toContain("تومان");
  });

  it("renders grouped numbers with Persian digits", () => {
    expect(formatNumber(1234)).toMatch(/[۰-۹]/);
  });
});
