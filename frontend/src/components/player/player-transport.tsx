"use client";

import { useEffect } from "react";

import { byId } from "@/lib/data/selectors";
import { useDb } from "@/lib/stores/db-store";
import { currentSongId, usePlayer } from "@/lib/stores/player-store";

const TICK_MS = 250;

/**
 * Drives the simulated transport clock.
 *
 * While a track is playing it advances {@link usePlayer}'s position every
 * {@link TICK_MS}, and hands off to `handleTrackEnd` (repeat / next) when the
 * track's duration is reached. Renders nothing.
 *
 * Phase 2: replace this timer with an `<audio>` element whose `timeupdate` and
 * `ended` events call `setPosition`/`handleTrackEnd` instead.
 */
export function PlayerTransport() {
  const isPlaying = usePlayer((s) => s.isPlaying);
  const songId = usePlayer(currentSongId);
  const songs = useDb((s) => s.songs);
  const setPosition = usePlayer((s) => s.setPosition);
  const handleTrackEnd = usePlayer((s) => s.handleTrackEnd);

  const duration = songId ? (byId(songs, songId)?.durationSec ?? 0) : 0;

  useEffect(() => {
    if (!isPlaying || duration <= 0) return;

    const interval = setInterval(() => {
      const { positionSec } = usePlayer.getState();
      if (positionSec + TICK_MS / 1000 >= duration) {
        handleTrackEnd();
      } else {
        setPosition(positionSec + TICK_MS / 1000);
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [isPlaying, duration, setPosition, handleTrackEnd]);

  return null;
}
