import { describe, expect, it } from "vitest";

import { seedCatalog } from "@/lib/mock/seed";
import type { User } from "@/lib/types";
import { artistNames, getLibraryItems, isVisibleToUser } from "./selectors";

const goldUser = { subscriptionTier: "gold" } as User;

describe("isVisibleToUser", () => {
  it("hides unreleased early-access items from non-gold users", () => {
    const future = { earlyAccess: true, releaseDate: "2999-01-01T00:00:00.000Z" };
    expect(isVisibleToUser(future, null)).toBe(false);
  });

  it("shows early-access items to gold users", () => {
    const future = { earlyAccess: true, releaseDate: "2999-01-01T00:00:00.000Z" };
    expect(isVisibleToUser(future, goldUser)).toBe(true);
  });

  it("shows ordinary items to everyone", () => {
    const ordinary = { earlyAccess: false, releaseDate: "2999-01-01T00:00:00.000Z" };
    expect(isVisibleToUser(ordinary, null)).toBe(true);
  });
});

describe("library + artist helpers", () => {
  it("getLibraryItems returns both albums and standalone singles", () => {
    const items = getLibraryItems(seedCatalog.albums, seedCatalog.songs);
    expect(items.some((i) => i.kind === "album")).toBe(true);
    expect(items.some((i) => i.kind === "single")).toBe(true);
  });

  it("artistNames joins collaborating artists with a separator", () => {
    const collab = seedCatalog.albums.find((a) => a.artistIds.length > 1)!;
    expect(artistNames(collab, seedCatalog.artists)).toContain("،");
  });
});
