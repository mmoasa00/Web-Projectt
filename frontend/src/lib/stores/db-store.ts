"use client";

/**
 * The mock "database".
 *
 * This Zustand store holds the entire {@link NavaDatabase} in memory, seeded
 * deterministically and persisted to `localStorage`. Every mutation the UI needs
 * lives here as an action, which keeps components free of persistence details.
 *
 * ── Phase 2 seam ──────────────────────────────────────────────────────────
 * When the Django/DRF backend exists, this is the file that changes: the action
 * bodies become `fetch`/`axios` calls and the persisted arrays become server
 * responses. The component-facing action names and the {@link NavaDatabase}
 * shapes are designed to survive that swap unchanged.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { TIERS } from "@/lib/config";
import { createSeedDatabase } from "@/lib/mock/seed";
import type {
  Album,
  AppNotification,
  Artist,
  NavaDatabase,
  NotificationKind,
  Playlist,
  Song,
  SubscriptionTier,
  TicketStatus,
  User,
} from "@/lib/types";

/** Short unique id with a readable prefix, e.g. `pl_3f8a1c`. */
function uid(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 6)
      : Math.random().toString(36).slice(2, 8);
  return `${prefix}_${rand}`;
}

const nowIso = () => new Date().toISOString();

export interface NewListenerInput {
  displayName: string;
  email: string;
  gender: User["gender"];
  birthDate?: string;
}

export interface NewArtistInput {
  name: string;
  email: string;
  portfolio: string;
}

export interface PublishSingleInput {
  title: string;
  genre: string;
  durationSec: number;
  releaseDate: string;
  lyrics?: string;
  collaboratorIds?: string[];
}

export interface PublishAlbumInput {
  title: string;
  genre: string;
  releaseDate: string;
  collaboratorIds?: string[];
  tracks: { title: string; durationSec: number; lyrics?: string }[];
}

interface DbActions {
  /** Wipe local changes and restore the seed (used by Settings / tests). */
  resetDatabase: () => void;

  // Accounts -----------------------------------------------------------------
  addListener: (input: NewListenerInput) => User;
  addArtistApplicant: (input: NewArtistInput) => { user: User; artist: Artist };
  updateUser: (userId: string, patch: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  toggleFollow: (userId: string, targetId: string) => void;
  setSubscription: (userId: string, tier: SubscriptionTier) => void;
  incrementDailyStreams: (userId: string) => void;

  // Artist verification ------------------------------------------------------
  approveArtist: (artistId: string) => void;
  rejectArtist: (artistId: string, reason: string) => void;

  // Catalog (artist studio) --------------------------------------------------
  publishSingle: (artistId: string, input: PublishSingleInput) => Song;
  publishAlbum: (artistId: string, input: PublishAlbumInput) => Album;
  updateSong: (songId: string, patch: Partial<Song>) => void;
  updateAlbum: (albumId: string, patch: Partial<Album>) => void;
  deleteSong: (songId: string) => void;
  deleteAlbum: (albumId: string) => void;

  // Playlists ----------------------------------------------------------------
  createPlaylist: (ownerId: string, name: string) => Playlist | null;
  renamePlaylist: (playlistId: string, name: string) => void;
  deletePlaylist: (playlistId: string) => void;
  toggleSongInPlaylist: (playlistId: string, songId: string) => void;

  // Notifications ------------------------------------------------------------
  addNotification: (
    notification: Omit<AppNotification, "id" | "createdAt" | "read"> &
      Partial<Pick<AppNotification, "read">>,
  ) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  deleteNotification: (notificationId: string) => void;

  // Support tickets ----------------------------------------------------------
  replyToTicket: (ticketId: string, body: string, authorName: string) => void;
  setTicketStatus: (ticketId: string, status: TicketStatus) => void;

  // Audit / payouts ----------------------------------------------------------
  settlePayout: (auditId: string) => void;

  // Platform settings --------------------------------------------------------
  updatePrices: (prices: { silver: number; gold: number }) => void;

  /** Internal: fan a "new release" notification out to an artist's followers. */
  notifyFollowersOfRelease: (artistId: string, title: string, href: string) => void;
}

export type DbState = NavaDatabase & DbActions;

export const useDb = create<DbState>()(
  persist(
    (set, get) => ({
      ...createSeedDatabase(),

      resetDatabase: () => set(createSeedDatabase()),

      // ── Accounts ──────────────────────────────────────────────────────────
      addListener: (input) => {
        const user: User = {
          id: uid("us"),
          email: input.email,
          role: "listener",
          displayName: input.displayName,
          username: `@nava_${Math.floor(1000 + Math.random() * 9000)}`,
          avatarSeed: input.displayName || input.email,
          gender: input.gender,
          birthDate: input.birthDate,
          createdAt: nowIso(),
          subscriptionTier: "basic",
          followingIds: [],
          followerCount: 0,
          dailyStreams: 0,
          preferences: { language: "fa", volume: 80, notificationsEnabled: true },
        };
        set((s) => ({ users: [...s.users, user] }));
        return user;
      },

      addArtistApplicant: (input) => {
        const artistId = uid("ar");
        const userId = uid("us");
        const artist: Artist = {
          id: artistId,
          userId,
          name: input.name,
          bio: "",
          avatarSeed: input.name || input.email,
          genres: [],
          verified: false,
          status: "pending",
          portfolio: input.portfolio,
          requestedAt: nowIso(),
          followerCount: 0,
          monthlyListeners: 0,
          totalStreams: 0,
        };
        const user: User = {
          id: userId,
          email: input.email,
          role: "artist",
          displayName: input.name,
          username: `@nava_artist_${Math.floor(100 + Math.random() * 900)}`,
          avatarSeed: input.name || input.email,
          gender: "unspecified",
          createdAt: nowIso(),
          subscriptionTier: "basic",
          followingIds: [],
          followerCount: 0,
          dailyStreams: 0,
          preferences: { language: "fa", volume: 80, notificationsEnabled: true },
          artistId,
        };
        // Notify staff so the request surfaces in their dashboards/notifications.
        const staff = get().users.filter(
          (u) => u.role === "support" || u.role === "admin",
        );
        const staffNotifications: AppNotification[] = staff.map((u) => ({
          id: uid("nt"),
          userId: u.id,
          kind: "new_artist_request",
          title: "درخواست احراز هویت جدید",
          body: `${input.name} درخواست حساب هنرمند ثبت کرد.`,
          createdAt: nowIso(),
          read: false,
          href: "/dashboard/approvals",
        }));
        set((s) => ({
          users: [...s.users, user],
          artists: [...s.artists, artist],
          notifications: [...staffNotifications, ...s.notifications],
        }));
        return { user, artist };
      },

      updateUser: (userId, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
        })),

      deleteUser: (userId) =>
        set((s) => ({
          users: s.users.filter((u) => u.id !== userId),
          playlists: s.playlists.filter((p) => p.ownerId !== userId),
          notifications: s.notifications.filter((n) => n.userId !== userId),
        })),

      toggleFollow: (userId, targetId) =>
        set((s) => ({
          users: s.users.map((u) => {
            if (u.id !== userId) return u;
            const following = u.followingIds.includes(targetId);
            return {
              ...u,
              followingIds: following
                ? u.followingIds.filter((id) => id !== targetId)
                : [...u.followingIds, targetId],
            };
          }),
          // Reflect the change in the target's follower count.
          artists: s.artists.map((a) =>
            a.id === targetId
              ? {
                  ...a,
                  followerCount:
                    a.followerCount +
                    (s.users.find((u) => u.id === userId)?.followingIds.includes(targetId)
                      ? -1
                      : 1),
                }
              : a,
          ),
        })),

      setSubscription: (userId, tier) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  subscriptionTier: tier,
                  subscriptionRenewsAt:
                    tier === "basic"
                      ? undefined
                      : new Date(Date.now() + 30 * 864e5).toISOString(),
                }
              : u,
          ),
        })),

      incrementDailyStreams: (userId) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === userId ? { ...u, dailyStreams: u.dailyStreams + 1 } : u,
          ),
        })),

      // ── Artist verification ───────────────────────────────────────────────
      approveArtist: (artistId) => {
        const artist = get().artists.find((a) => a.id === artistId);
        if (!artist) return;
        set((s) => ({
          artists: s.artists.map((a) =>
            a.id === artistId
              ? { ...a, status: "approved", verified: true, rejectionReason: undefined }
              : a,
          ),
          notifications: [
            {
              id: uid("nt"),
              userId: artist.userId,
              kind: "artist_verdict" as NotificationKind,
              title: "حساب هنرمندی شما تایید شد",
              body: "اکنون می‌توانید آثار خود را منتشر کنید.",
              createdAt: nowIso(),
              read: false,
              href: "/studio",
            },
            ...s.notifications,
          ],
        }));
      },

      rejectArtist: (artistId, reason) => {
        const artist = get().artists.find((a) => a.id === artistId);
        if (!artist) return;
        set((s) => ({
          artists: s.artists.map((a) =>
            a.id === artistId ? { ...a, status: "rejected", verified: false, rejectionReason: reason } : a,
          ),
          notifications: [
            {
              id: uid("nt"),
              userId: artist.userId,
              kind: "artist_verdict" as NotificationKind,
              title: "درخواست هنرمندی شما رد شد",
              body: `دلیل: ${reason}`,
              createdAt: nowIso(),
              read: false,
            },
            ...s.notifications,
          ],
        }));
      },

      // ── Catalog ───────────────────────────────────────────────────────────
      publishSingle: (artistId, input) => {
        const song: Song = {
          id: uid("sg"),
          title: input.title,
          artistIds: [artistId, ...(input.collaboratorIds ?? [])],
          coverSeed: uid("cover"),
          durationSec: input.durationSec,
          genre: input.genre,
          releaseDate: input.releaseDate,
          lyrics: input.lyrics,
          streamCount: 0,
          listenerCount: 0,
          earlyAccess: false,
        };
        set((s) => ({ songs: [song, ...s.songs] }));
        get().notifyFollowersOfRelease(artistId, song.title, `/library`);
        return song;
      },

      publishAlbum: (artistId, input) => {
        const albumId = uid("al");
        const artistIds = [artistId, ...(input.collaboratorIds ?? [])];
        const tracks: Song[] = input.tracks.map((t) => ({
          id: uid("sg"),
          title: t.title,
          artistIds,
          albumId,
          coverSeed: albumId,
          durationSec: t.durationSec,
          genre: input.genre,
          releaseDate: input.releaseDate,
          lyrics: t.lyrics,
          streamCount: 0,
          listenerCount: 0,
          earlyAccess: false,
        }));
        const album: Album = {
          id: albumId,
          title: input.title,
          artistIds,
          coverSeed: albumId,
          releaseDate: input.releaseDate,
          genre: input.genre,
          type: "album",
          songIds: tracks.map((t) => t.id),
          streamCount: 0,
          listenerCount: 0,
          earlyAccess: false,
        };
        set((s) => ({ albums: [album, ...s.albums], songs: [...tracks, ...s.songs] }));
        get().notifyFollowersOfRelease(artistId, input.title, `/album/${albumId}`);
        return album;
      },

      updateSong: (songId, patch) =>
        set((s) => ({
          songs: s.songs.map((song) => (song.id === songId ? { ...song, ...patch } : song)),
        })),

      updateAlbum: (albumId, patch) =>
        set((s) => ({
          albums: s.albums.map((album) =>
            album.id === albumId ? { ...album, ...patch } : album,
          ),
        })),

      deleteSong: (songId) =>
        set((s) => ({
          songs: s.songs.filter((song) => song.id !== songId),
          albums: s.albums.map((a) => ({
            ...a,
            songIds: a.songIds.filter((id) => id !== songId),
          })),
          playlists: s.playlists.map((p) => ({
            ...p,
            songIds: p.songIds.filter((id) => id !== songId),
          })),
        })),

      deleteAlbum: (albumId) =>
        set((s) => {
          const removedSongIds = new Set(
            s.songs.filter((song) => song.albumId === albumId).map((song) => song.id),
          );
          return {
            albums: s.albums.filter((a) => a.id !== albumId),
            songs: s.songs.filter((song) => song.albumId !== albumId),
            playlists: s.playlists.map((p) => ({
              ...p,
              songIds: p.songIds.filter((id) => !removedSongIds.has(id)),
            })),
          };
        }),

      // ── Playlists ─────────────────────────────────────────────────────────
      createPlaylist: (ownerId, name) => {
        const owner = get().users.find((u) => u.id === ownerId);
        if (!owner) return null;
        const owned = get().playlists.filter((p) => p.ownerId === ownerId);
        const limit = TIERS[owner.subscriptionTier].playlistLimit;
        if (owned.length >= limit) return null; // caller surfaces the limit message
        const playlist: Playlist = {
          id: uid("pl"),
          ownerId,
          name,
          coverSeed: uid("cover"),
          songIds: [],
          createdAt: nowIso(),
        };
        set((s) => ({ playlists: [...s.playlists, playlist] }));
        return playlist;
      },

      renamePlaylist: (playlistId, name) =>
        set((s) => ({
          playlists: s.playlists.map((p) => (p.id === playlistId ? { ...p, name } : p)),
        })),

      deletePlaylist: (playlistId) =>
        set((s) => ({ playlists: s.playlists.filter((p) => p.id !== playlistId) })),

      toggleSongInPlaylist: (playlistId, songId) =>
        set((s) => ({
          playlists: s.playlists.map((p) => {
            if (p.id !== playlistId) return p;
            const has = p.songIds.includes(songId);
            return {
              ...p,
              songIds: has ? p.songIds.filter((id) => id !== songId) : [...p.songIds, songId],
            };
          }),
        })),

      // ── Notifications ─────────────────────────────────────────────────────
      addNotification: (notification) =>
        set((s) => ({
          notifications: [
            { ...notification, id: uid("nt"), createdAt: nowIso(), read: notification.read ?? false },
            ...s.notifications,
          ],
        })),

      markNotificationRead: (notificationId) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n,
          ),
        })),

      markAllNotificationsRead: (userId) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n,
          ),
        })),

      deleteNotification: (notificationId) =>
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== notificationId),
        })),

      // ── Tickets ───────────────────────────────────────────────────────────
      replyToTicket: (ticketId, body, authorName) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId
              ? {
                  ...t,
                  status: "answered",
                  messages: [
                    ...t.messages,
                    {
                      id: uid("tm"),
                      authorRole: "support",
                      authorName,
                      body,
                      createdAt: nowIso(),
                    },
                  ],
                }
              : t,
          ),
        })),

      setTicketStatus: (ticketId, status) =>
        set((s) => ({
          tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
        })),

      // ── Audit / payouts ───────────────────────────────────────────────────
      settlePayout: (auditId) =>
        set((s) => ({
          audits: s.audits.map((a) => (a.id === auditId ? { ...a, status: "settled" } : a)),
        })),

      // ── Settings ──────────────────────────────────────────────────────────
      updatePrices: (prices) => set(() => ({ settings: { prices } })),

      // Internal helper (not part of the public action surface).
      notifyFollowersOfRelease(artistId: string, title: string, href: string) {
        const followers = get().users.filter((u) => u.followingIds.includes(artistId));
        if (followers.length === 0) return;
        const artist = get().artists.find((a) => a.id === artistId);
        const created: AppNotification[] = followers.map((u) => ({
          id: uid("nt"),
          userId: u.id,
          kind: "new_release",
          title: `اثر جدید از ${artist?.name ?? "هنرمند"}`,
          body: `«${title}» منتشر شد.`,
          createdAt: nowIso(),
          read: false,
          href,
        }));
        set((s) => ({ notifications: [...created, ...s.notifications] }));
      },
    }),
    {
      name: "nava-db",
      version: 1,
      // Persist only the data; actions are re-created from code on every load.
      partialize: (s): NavaDatabase => ({
        users: s.users,
        artists: s.artists,
        songs: s.songs,
        albums: s.albums,
        playlists: s.playlists,
        notifications: s.notifications,
        tickets: s.tickets,
        audits: s.audits,
        settings: s.settings,
      }),
    },
  ),
);
