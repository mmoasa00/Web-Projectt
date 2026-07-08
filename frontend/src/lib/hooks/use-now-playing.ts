"use client";

import { byId } from "@/lib/data/selectors";
import { useDb } from "@/lib/stores/db-store";
import { currentSongId, usePlayer } from "@/lib/stores/player-store";
import type { Album, Artist, Song } from "@/lib/types";

export interface NowPlaying {
  song: Song;
  artists: Artist[];
  album?: Album;
}

/** Resolve the currently loaded track (and its artists/album) from the queue. */
export function useNowPlaying(): NowPlaying | null {
  const songId = usePlayer(currentSongId);
  const songs = useDb((s) => s.songs);
  const artists = useDb((s) => s.artists);
  const albums = useDb((s) => s.albums);

  if (!songId) return null;
  const song = byId(songs, songId);
  if (!song) return null;

  return {
    song,
    artists: song.artistIds
      .map((id) => byId(artists, id))
      .filter((a): a is Artist => Boolean(a)),
    album: song.albumId ? byId(albums, song.albumId) : undefined,
  };
}
