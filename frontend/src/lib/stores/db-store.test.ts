import { beforeEach, describe, expect, it } from "vitest";

import { getUserPlaylists } from "@/lib/data/selectors";
import { useDb } from "./db-store";

beforeEach(() => {
  useDb.getState().resetDatabase();
});

describe("playlist limits by tier", () => {
  it("blocks a 7th playlist for a basic-tier user (limit 6)", () => {
    const create = () => useDb.getState().createPlaylist("us_basic", "list");
    for (let i = 0; i < 6; i++) expect(create()).not.toBeNull();
    expect(create()).toBeNull(); // 7th is rejected
    expect(getUserPlaylists(useDb.getState().playlists, "us_basic")).toHaveLength(6);
  });

  it("allows many playlists for a gold-tier user (unlimited)", () => {
    for (let i = 0; i < 12; i++) {
      expect(useDb.getState().createPlaylist("us_gold", `g${i}`)).not.toBeNull();
    }
  });
});

describe("following", () => {
  it("toggles follow and keeps the artist follower count in sync", () => {
    const followerOf = () =>
      useDb.getState().artists.find((a) => a.id === "ar_mahtab")!.followerCount;
    const isFollowing = () =>
      useDb.getState().users.find((u) => u.id === "us_basic")!.followingIds.includes("ar_mahtab");

    const before = followerOf();
    useDb.getState().toggleFollow("us_basic", "ar_mahtab");
    expect(isFollowing()).toBe(true);
    expect(followerOf()).toBe(before + 1);

    useDb.getState().toggleFollow("us_basic", "ar_mahtab");
    expect(isFollowing()).toBe(false);
    expect(followerOf()).toBe(before);
  });
});

describe("artist verification", () => {
  it("approves a pending artist and notifies them", () => {
    useDb.getState().approveArtist("ar_horshid");
    const artist = useDb.getState().artists.find((a) => a.id === "ar_horshid")!;
    expect(artist.status).toBe("approved");
    expect(artist.verified).toBe(true);

    const notification = useDb
      .getState()
      .notifications.find((n) => n.userId === "us_pending" && n.kind === "artist_verdict");
    expect(notification?.title).toContain("تایید");
  });

  it("rejects a pending artist with a reason", () => {
    useDb.getState().rejectArtist("ar_horshid", "کیفیت نمونه‌کارها کافی نبود");
    const artist = useDb.getState().artists.find((a) => a.id === "ar_horshid")!;
    expect(artist.status).toBe("rejected");
    expect(artist.rejectionReason).toContain("کیفیت");
  });
});

describe("playlists & pricing", () => {
  it("adds and removes a song from a playlist", () => {
    const playlist = useDb.getState().createPlaylist("us_gold", "Test")!;
    useDb.getState().toggleSongInPlaylist(playlist.id, "sg_01");
    expect(
      useDb.getState().playlists.find((p) => p.id === playlist.id)!.songIds,
    ).toContain("sg_01");

    useDb.getState().toggleSongInPlaylist(playlist.id, "sg_01");
    expect(
      useDb.getState().playlists.find((p) => p.id === playlist.id)!.songIds,
    ).not.toContain("sg_01");
  });

  it("updates subscription prices dynamically", () => {
    useDb.getState().updatePrices({ silver: 99000, gold: 199000 });
    expect(useDb.getState().settings.prices).toEqual({ silver: 99000, gold: 199000 });
  });
});
