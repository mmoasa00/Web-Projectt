/**
 * Deterministic seed data for the Phase 1 mock.
 *
 * Everything here is static (no `Date.now()`/randomness) so that the server and
 * client render identical markup, and so demos/tests are reproducible. The data
 * is also the "fixtures" the Phase 2 backend can import to bootstrap a database.
 *
 * Demo accounts (any password works — auth is mocked):
 *   basic@nava.app    listener · basic tier
 *   silver@nava.app   listener · silver tier
 *   gold@nava.app     listener · gold tier (owns the seeded playlists)
 *   artist@nava.app   artist   · verified
 *   pending@nava.app  artist   · awaiting verification
 *   support@nava.app  support
 *   admin@nava.app    admin
 */

import type {
  Album,
  Artist,
  AuditEntry,
  AppNotification,
  NavaDatabase,
  Playlist,
  Song,
  Ticket,
  User,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Artists
// ---------------------------------------------------------------------------

const artists: Artist[] = [
  {
    id: "ar_benyamin",
    userId: "us_artist",
    name: "بنیامین",
    bio: "خواننده و آهنگساز پاپ با تلفیقی از سازهای ایرانی و الکترونیک.",
    avatarSeed: "benyamin",
    genres: ["پاپ", "الکترونیک"],
    verified: true,
    status: "approved",
    portfolio: "https://example.com/benyamin",
    requestedAt: "2024-09-01T10:00:00.000Z",
    followerCount: 184200,
    monthlyListeners: 642000,
    totalStreams: 9120000,
  },
  {
    id: "ar_mahtab",
    userId: "us_mahtab",
    name: "مهتاب",
    bio: "ترانه‌سرا و خواننده‌ی فولک؛ روایت‌های ساده از زندگی روزمره.",
    avatarSeed: "mahtab",
    genres: ["فولک", "پاپ"],
    verified: true,
    status: "approved",
    portfolio: "https://example.com/mahtab",
    requestedAt: "2024-10-12T10:00:00.000Z",
    followerCount: 96500,
    monthlyListeners: 305000,
    totalStreams: 4310000,
  },
  {
    id: "ar_kaveh",
    userId: "us_kaveh",
    name: "کاوه",
    bio: "تهیه‌کننده‌ی موسیقی الکترونیک و های‌هاپ.",
    avatarSeed: "kaveh",
    genres: ["هیپ‌هاپ", "الکترونیک"],
    verified: true,
    status: "approved",
    portfolio: "https://example.com/kaveh",
    requestedAt: "2025-01-05T10:00:00.000Z",
    followerCount: 142000,
    monthlyListeners: 488000,
    totalStreams: 6750000,
  },
  {
    id: "ar_shabdiz",
    userId: "us_shabdiz",
    name: "شبدیز",
    bio: "گروه راک با حال‌وهوای دهه‌ی هفتاد.",
    avatarSeed: "shabdiz",
    genres: ["راک"],
    verified: true,
    status: "approved",
    portfolio: "https://example.com/shabdiz",
    requestedAt: "2025-02-20T10:00:00.000Z",
    followerCount: 58300,
    monthlyListeners: 171000,
    totalStreams: 2240000,
  },
  {
    id: "ar_ava",
    userId: "us_ava",
    name: "آوا بَند",
    bio: "موسیقی تلفیقی سنتی و کلاسیک.",
    avatarSeed: "ava",
    genres: ["سنتی", "کلاسیک"],
    verified: true,
    status: "approved",
    portfolio: "https://example.com/ava",
    requestedAt: "2025-03-18T10:00:00.000Z",
    followerCount: 73900,
    monthlyListeners: 214000,
    totalStreams: 3010000,
  },
  {
    // The pending applicant shown in the dashboard approval queue.
    id: "ar_horshid",
    userId: "us_pending",
    name: "هورشید",
    bio: "هنرمند نوظهور در ژانر الکترونیک.",
    avatarSeed: "horshid",
    genres: ["الکترونیک"],
    verified: false,
    status: "pending",
    portfolio: "https://soundcloud.com/horshid-demo, https://example.com/horshid-portfolio",
    requestedAt: "2026-06-19T08:30:00.000Z",
    followerCount: 0,
    monthlyListeners: 0,
    totalStreams: 0,
  },
];

// ---------------------------------------------------------------------------
// Catalog (albums + songs)
//
// Built with small helpers so relationships (album.songIds <-> song.albumId)
// stay consistent and counts/durations are deterministic functions of an index.
// ---------------------------------------------------------------------------

interface SongDraft {
  title: string;
  durationSec: number;
  lyrics?: string;
  earlyAccess?: boolean;
}

const SAMPLE_LYRICS =
  "این یک نمونه‌متن آهنگ است\nکه در فاز اول به‌صورت ماک نمایش داده می‌شود\nتا چیدمان بخش «متن آهنگ» در پخش‌کننده مشخص شود.";

let songCounter = 1;
const allSongs: Song[] = [];

function makeSong(
  draft: SongDraft,
  artistIds: string[],
  genre: string,
  releaseDate: string,
  albumId?: string,
): Song {
  const i = songCounter++;
  const song: Song = {
    id: `sg_${i.toString().padStart(2, "0")}`,
    title: draft.title,
    artistIds,
    albumId,
    coverSeed: albumId ?? `single-${i}`,
    durationSec: draft.durationSec,
    genre,
    releaseDate,
    lyrics: draft.lyrics,
    streamCount: 28000 + i * 5417,
    listenerCount: Math.round((28000 + i * 5417) * 0.34),
    earlyAccess: draft.earlyAccess ?? false,
  };
  allSongs.push(song);
  return song;
}

interface AlbumDraft {
  id: string;
  title: string;
  artistIds: string[];
  genre: string;
  releaseDate: string;
  earlyAccess?: boolean;
  songs: SongDraft[];
}

function makeAlbum(draft: AlbumDraft): Album {
  const songs = draft.songs.map((s) =>
    makeSong(
      { ...s, lyrics: s.lyrics ?? SAMPLE_LYRICS },
      draft.artistIds,
      draft.genre,
      draft.releaseDate,
      draft.id,
    ),
  );
  const streamCount = songs.reduce((sum, s) => sum + s.streamCount, 0);
  return {
    id: draft.id,
    title: draft.title,
    artistIds: draft.artistIds,
    coverSeed: draft.id,
    releaseDate: draft.releaseDate,
    genre: draft.genre,
    type: "album",
    songIds: songs.map((s) => s.id),
    streamCount,
    listenerCount: Math.round(streamCount * 0.3),
    earlyAccess: draft.earlyAccess ?? false,
  };
}

const albums: Album[] = [
  makeAlbum({
    id: "al_paeez",
    title: "پاییز هزار رنگ",
    artistIds: ["ar_benyamin"],
    genre: "پاپ",
    releaseDate: "2025-10-02T00:00:00.000Z",
    songs: [
      { title: "آغاز", durationSec: 213 },
      { title: "هزار رنگ", durationSec: 247 },
      { title: "شب بی‌ستاره", durationSec: 198 },
      { title: "تا همیشه", durationSec: 263 },
    ],
  }),
  makeAlbum({
    id: "al_kook",
    title: "کوک",
    artistIds: ["ar_mahtab"],
    genre: "فولک",
    releaseDate: "2025-06-14T00:00:00.000Z",
    songs: [
      { title: "کوچه‌باغ", durationSec: 226 },
      { title: "نامه", durationSec: 201 },
      { title: "پنجره", durationSec: 235 },
    ],
  }),
  makeAlbum({
    id: "al_shab",
    title: "شب‌شهر",
    artistIds: ["ar_kaveh"],
    genre: "هیپ‌هاپ",
    releaseDate: "2025-11-20T00:00:00.000Z",
    songs: [
      { title: "نئون", durationSec: 188 },
      { title: "خیابان خیس", durationSec: 205, earlyAccess: false },
      { title: "هم‌قدم", durationSec: 219 },
      { title: "بی‌خوابی", durationSec: 176 },
    ],
  }),
  makeAlbum({
    id: "al_atash",
    title: "آتش سرد",
    artistIds: ["ar_shabdiz"],
    genre: "راک",
    releaseDate: "2025-08-09T00:00:00.000Z",
    songs: [
      { title: "جاده", durationSec: 254 },
      { title: "فریاد", durationSec: 231 },
      { title: "بازگشت", durationSec: 268 },
    ],
  }),
  makeAlbum({
    id: "al_neda",
    title: "ندای کهن",
    artistIds: ["ar_ava"],
    genre: "سنتی",
    releaseDate: "2026-01-15T00:00:00.000Z",
    songs: [
      { title: "نوای دل", durationSec: 312 },
      { title: "چهارمضراب", durationSec: 274 },
      { title: "آواز", durationSec: 298 },
    ],
  }),
  // A gold-tier early-access album (released to gold members ahead of time).
  makeAlbum({
    id: "al_farda",
    title: "فردا",
    artistIds: ["ar_benyamin", "ar_kaveh"],
    genre: "الکترونیک",
    releaseDate: "2026-07-10T00:00:00.000Z",
    earlyAccess: true,
    songs: [
      { title: "طلوع دوباره", durationSec: 222, earlyAccess: true },
      { title: "مدار", durationSec: 240, earlyAccess: true },
      { title: "فردا", durationSec: 256, earlyAccess: true },
    ],
  }),
];

// Standalone singles (no album).
const singles: Song[] = [
  makeSong({ title: "تنهاترین", durationSec: 209 }, ["ar_benyamin"], "پاپ", "2026-03-01T00:00:00.000Z"),
  makeSong({ title: "باران که زد", durationSec: 231 }, ["ar_mahtab"], "فولک", "2026-04-18T00:00:00.000Z"),
  makeSong({ title: "ریتم شهر", durationSec: 187 }, ["ar_kaveh", "ar_shabdiz"], "هیپ‌هاپ", "2026-05-22T00:00:00.000Z"),
  makeSong({ title: "نسیم", durationSec: 244 }, ["ar_ava"], "کلاسیک", "2026-02-09T00:00:00.000Z"),
  makeSong(
    { title: "نقطه‌ی صفر", durationSec: 198, earlyAccess: true },
    ["ar_kaveh"],
    "الکترونیک",
    "2026-07-05T00:00:00.000Z",
  ),
];

const songs: Song[] = allSongs;

// ---------------------------------------------------------------------------
// Users (demo accounts)
// ---------------------------------------------------------------------------

function listener(
  overrides: Partial<User> & Pick<User, "id" | "email" | "displayName" | "username" | "avatarSeed">,
): User {
  return {
    role: "listener",
    gender: "unspecified",
    createdAt: "2025-05-01T00:00:00.000Z",
    subscriptionTier: "basic",
    followingIds: [],
    followerCount: 0,
    dailyStreams: 0,
    preferences: { language: "fa", volume: 80, notificationsEnabled: true },
    ...overrides,
  };
}

const users: User[] = [
  listener({
    id: "us_basic",
    email: "basic@nava.app",
    displayName: "نگار محمدی",
    username: "@nava_1042",
    avatarSeed: "negar",
    gender: "female",
    birthDate: "2001-03-21",
    subscriptionTier: "basic",
    dailyStreams: 47,
    followingIds: ["ar_benyamin"],
    followerCount: 12,
  }),
  listener({
    id: "us_silver",
    email: "silver@nava.app",
    displayName: "آرش رضایی",
    username: "@nava_2087",
    avatarSeed: "arash",
    gender: "male",
    birthDate: "1998-11-02",
    subscriptionTier: "silver",
    subscriptionRenewsAt: "2026-07-20T00:00:00.000Z",
    dailyStreams: 132,
    followingIds: ["ar_mahtab", "ar_kaveh"],
    followerCount: 38,
  }),
  listener({
    id: "us_gold",
    email: "gold@nava.app",
    displayName: "سارا کریمی",
    username: "@nava_3001",
    avatarSeed: "sara",
    gender: "female",
    birthDate: "1996-07-15",
    subscriptionTier: "gold",
    subscriptionRenewsAt: "2026-08-30T00:00:00.000Z",
    dailyStreams: 318,
    followingIds: ["ar_benyamin", "ar_mahtab", "ar_ava", "us_silver"],
    followerCount: 254,
  }),
  // Artist account (verified) — also a listener with a gold plan.
  {
    id: "us_artist",
    email: "artist@nava.app",
    role: "artist",
    displayName: "بنیامین",
    username: "@nava_artist_01",
    avatarSeed: "benyamin",
    gender: "male",
    birthDate: "1990-01-30",
    createdAt: "2024-09-01T00:00:00.000Z",
    subscriptionTier: "gold",
    subscriptionRenewsAt: "2026-12-01T00:00:00.000Z",
    followingIds: ["ar_kaveh"],
    followerCount: 184200,
    dailyStreams: 12,
    preferences: { language: "fa", volume: 70, notificationsEnabled: true },
    artistId: "ar_benyamin",
  },
  // Pending artist applicant.
  {
    id: "us_pending",
    email: "pending@nava.app",
    role: "artist",
    displayName: "هورشید",
    username: "@nava_artist_02",
    avatarSeed: "horshid",
    gender: "unspecified",
    createdAt: "2026-06-19T00:00:00.000Z",
    subscriptionTier: "basic",
    followingIds: [],
    followerCount: 0,
    dailyStreams: 0,
    preferences: { language: "fa", volume: 80, notificationsEnabled: true },
    artistId: "ar_horshid",
  },
  // Staff accounts.
  {
    id: "us_support",
    email: "support@nava.app",
    role: "support",
    displayName: "مریم (پشتیبانی)",
    username: "@nava_support",
    avatarSeed: "support",
    gender: "female",
    createdAt: "2025-01-01T00:00:00.000Z",
    subscriptionTier: "basic",
    followingIds: [],
    followerCount: 0,
    dailyStreams: 0,
    preferences: { language: "fa", volume: 80, notificationsEnabled: true },
  },
  {
    id: "us_admin",
    email: "admin@nava.app",
    role: "admin",
    displayName: "مدیر سامانه",
    username: "@nava_admin",
    avatarSeed: "admin",
    gender: "unspecified",
    createdAt: "2024-08-01T00:00:00.000Z",
    subscriptionTier: "basic",
    followingIds: [],
    followerCount: 0,
    dailyStreams: 0,
    preferences: { language: "fa", volume: 80, notificationsEnabled: true },
  },
  // Lightweight artist-owner accounts (catalog artists). Not used as demo logins.
  ...["ar_mahtab", "ar_kaveh", "ar_shabdiz", "ar_ava"].map((artistId, i) => {
    const artist = artists.find((a) => a.id === artistId)!;
    return {
      id: artist.userId,
      email: `${artistId}@nava.app`,
      role: "artist" as const,
      displayName: artist.name,
      username: `@nava_artist_1${i}`,
      avatarSeed: artist.avatarSeed,
      gender: "unspecified" as const,
      createdAt: artist.requestedAt,
      subscriptionTier: "gold" as const,
      followingIds: [],
      followerCount: artist.followerCount,
      dailyStreams: 0,
      preferences: { language: "fa" as const, volume: 80, notificationsEnabled: true },
      artistId: artist.id,
    };
  }),
];

// ---------------------------------------------------------------------------
// Playlists (owned by the gold demo user)
// ---------------------------------------------------------------------------

const playlists: Playlist[] = [
  {
    id: "pl_morning",
    ownerId: "us_gold",
    name: "صبح‌های آرام",
    coverSeed: "pl_morning",
    songIds: ["sg_01", "sg_05", "sg_11", "sg_17"],
    createdAt: "2026-05-10T00:00:00.000Z",
  },
  {
    id: "pl_focus",
    ownerId: "us_gold",
    name: "تمرکز",
    coverSeed: "pl_focus",
    songIds: ["sg_08", "sg_14", "sg_18"],
    createdAt: "2026-05-28T00:00:00.000Z",
  },
  {
    id: "pl_drive",
    ownerId: "us_gold",
    name: "جاده",
    coverSeed: "pl_drive",
    songIds: ["sg_11", "sg_12", "sg_19"],
    createdAt: "2026-06-15T00:00:00.000Z",
  },
];

// ---------------------------------------------------------------------------
// Notifications (role-specific, per the brief)
// ---------------------------------------------------------------------------

const notifications: AppNotification[] = [
  {
    id: "nt_01",
    userId: "us_silver",
    kind: "subscription_expiring",
    title: "اشتراک نقره‌ای شما رو به پایان است",
    body: "۵ روز تا پایان اشتراک شما باقی مانده. برای تمدید به تنظیمات مراجعه کنید.",
    createdAt: "2026-06-21T09:00:00.000Z",
    read: false,
    href: "/settings",
  },
  {
    id: "nt_02",
    userId: "us_gold",
    kind: "new_release",
    title: "اثر جدید از بنیامین",
    body: "آلبوم «فردا» منتشر شد. همین حالا گوش کنید.",
    createdAt: "2026-06-22T18:30:00.000Z",
    read: false,
    href: "/album/al_farda",
  },
  {
    id: "nt_03",
    userId: "us_gold",
    kind: "new_release",
    title: "تک‌آهنگ جدید از مهتاب",
    body: "«باران که زد» اکنون در دسترس است.",
    createdAt: "2026-06-18T11:00:00.000Z",
    read: true,
    href: "/album/al_kook",
  },
  {
    id: "nt_04",
    userId: "us_artist",
    kind: "artist_payout",
    title: "محاسبات مالی خرداد آماده شد",
    body: "گزارش شنوندگان و استریم‌های این ماه شما ثبت شد.",
    createdAt: "2026-06-20T08:00:00.000Z",
    read: false,
  },
  {
    id: "nt_05",
    userId: "us_pending",
    kind: "artist_verdict",
    title: "درخواست هنرمندی شما در حال بررسی است",
    body: "نمونه‌کارهای شما دریافت شد و به‌زودی بررسی می‌شود.",
    createdAt: "2026-06-19T08:35:00.000Z",
    read: true,
  },
  {
    id: "nt_06",
    userId: "us_support",
    kind: "new_ticket",
    title: "تیکت جدید: مشکل در پرداخت",
    body: "کاربر آرش رضایی یک تیکت پشتیبانی ثبت کرد.",
    createdAt: "2026-06-23T14:10:00.000Z",
    read: false,
    href: "/dashboard/tickets",
  },
  {
    id: "nt_07",
    userId: "us_support",
    kind: "new_artist_request",
    title: "درخواست احراز هویت جدید",
    body: "هورشید درخواست حساب هنرمند ثبت کرد.",
    createdAt: "2026-06-19T08:31:00.000Z",
    read: false,
    href: "/dashboard/approvals",
  },
  {
    id: "nt_08",
    userId: "us_admin",
    kind: "new_artist_request",
    title: "درخواست احراز هویت جدید",
    body: "هورشید درخواست حساب هنرمند ثبت کرد.",
    createdAt: "2026-06-19T08:31:00.000Z",
    read: false,
    href: "/dashboard/approvals",
  },
];

// ---------------------------------------------------------------------------
// Support tickets
// ---------------------------------------------------------------------------

const tickets: Ticket[] = [
  {
    id: "TK-1042",
    userId: "us_silver",
    userName: "آرش رضایی",
    subject: "مشکل در پرداخت اشتراک",
    status: "open",
    createdAt: "2026-06-23T14:05:00.000Z",
    messages: [
      {
        id: "tm_1",
        authorRole: "user",
        authorName: "آرش رضایی",
        body: "سلام، هنگام ارتقا به اشتراک نقره‌ای پرداختم ناموفق شد ولی مبلغ کم شد.",
        createdAt: "2026-06-23T14:05:00.000Z",
      },
    ],
  },
  {
    id: "TK-1041",
    userId: "us_basic",
    userName: "نگار محمدی",
    subject: "سوال درباره محدودیت پلی‌لیست",
    status: "answered",
    createdAt: "2026-06-20T10:00:00.000Z",
    messages: [
      {
        id: "tm_2",
        authorRole: "user",
        authorName: "نگار محمدی",
        body: "چرا نمی‌توانم پلی‌لیست هفتم را بسازم؟",
        createdAt: "2026-06-20T10:00:00.000Z",
      },
      {
        id: "tm_3",
        authorRole: "support",
        authorName: "مریم (پشتیبانی)",
        body: "سلام، در اشتراک پایه حداکثر ۶ پلی‌لیست می‌توانید بسازید. با ارتقا به نقره‌ای این محدودیت برداشته می‌شود.",
        createdAt: "2026-06-20T11:30:00.000Z",
      },
    ],
  },
  {
    id: "TK-1039",
    userId: "us_gold",
    userName: "سارا کریمی",
    subject: "درخواست حذف یک آهنگ از تاریخچه",
    status: "closed",
    createdAt: "2026-06-12T09:20:00.000Z",
    messages: [
      {
        id: "tm_4",
        authorRole: "user",
        authorName: "سارا کریمی",
        body: "می‌خواهم تاریخچه‌ی پخشم پاک شود.",
        createdAt: "2026-06-12T09:20:00.000Z",
      },
      {
        id: "tm_5",
        authorRole: "support",
        authorName: "مریم (پشتیبانی)",
        body: "انجام شد. موردی دیگری بود در خدمتم.",
        createdAt: "2026-06-12T10:00:00.000Z",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Monthly payout audit (admin dashboard)
// ---------------------------------------------------------------------------

const audits: AuditEntry[] = artists
  .filter((a) => a.status === "approved")
  .map((a, i) => ({
    id: `au_${i + 1}`,
    artistId: a.id,
    artistName: a.name,
    period: "1405-03",
    uniqueListeners: a.monthlyListeners,
    // Placeholder estimate; Phase 2 replaces this with the real reward formula.
    rewardToman: Math.round(a.monthlyListeners * 0.5 + a.totalStreams * 0.002),
    totalStreams: Math.round(a.totalStreams / 12),
    status: i % 2 === 0 ? "pending" : "settled",
  }));

// ---------------------------------------------------------------------------

/** A fresh copy of the seed database. */
export function createSeedDatabase(): NavaDatabase {
  return {
    users,
    artists,
    songs,
    albums,
    playlists,
    notifications,
    tickets,
    audits,
    settings: {
      prices: { silver: 79000, gold: 149000 },
    },
  };
}

/** Convenience exports for tests and selectors that only need the catalog. */
export const seedCatalog = { artists, albums, songs, singles };
