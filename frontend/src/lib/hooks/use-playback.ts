"use client";

/**
 * Playback *policy* on top of the pure transport.
 *
 * The {@link usePlayer} store knows how to play a queue; this hook decides
 * whether the current user is *allowed* to start a new stream (the basic-tier
 * daily cap from the brief) and records the stream against their account.
 * Keeping policy here means every "play" button shares one rule set and the
 * transport store stays dependency-free.
 */

import { toast } from "sonner";

import { TIERS } from "@/lib/config";
import { useDb } from "@/lib/stores/db-store";
import { usePlayer } from "@/lib/stores/player-store";
import { useCurrentUser } from "@/lib/stores/session-store";

export function usePlayback() {
  const user = useCurrentUser();
  const playContext = usePlayer((s) => s.playContext);
  const playSongInContext = usePlayer((s) => s.playSongInContext);
  const incrementDailyStreams = useDb((s) => s.incrementDailyStreams);

  const remaining = user
    ? TIERS[user.subscriptionTier].dailyStreamLimit - user.dailyStreams
    : Infinity;

  const canStartStream = remaining > 0;

  /** Returns false (and warns) when the daily cap has been reached. */
  function guardCap(): boolean {
    if (canStartStream) return true;
    toast.error("به سقف استریم روزانه رسیدید", {
      description: "برای استریم نامحدود، اشتراک خود را ارتقا دهید.",
    });
    return false;
  }

  function recordStream() {
    if (user) incrementDailyStreams(user.id);
  }

  return {
    canStartStream,
    remaining,
    /** Play one song within a context list (album, playlist, search results). */
    playSong(songIds: string[], songId: string) {
      if (!guardCap()) return;
      playSongInContext(songIds, songId);
      recordStream();
    },
    /** Play a whole list starting at an index. */
    playList(songIds: string[], startIndex = 0) {
      if (songIds.length === 0 || !guardCap()) return;
      playContext(songIds, startIndex);
      recordStream();
    },
  };
}
