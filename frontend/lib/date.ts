const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Backend timestamps are naive UTC (e.g. Python's datetime.utcnow() / SQLite
 * CURRENT_TIMESTAMP), serialized with no "Z" or offset suffix — e.g.
 * "2026-07-27T08:04:51.719417". Per the ECMAScript Date spec, a date-time
 * string with no timezone designator is parsed as LOCAL time, not UTC, so
 * `new Date(iso)` silently shifts the instant by the viewer's UTC offset
 * (for IST, +5:30 — enough to make "5h ago" actually wrong). Appending "Z"
 * when one isn't already present fixes the parse.
 */
export function parseUtcTimestamp(iso: string): Date {
  const hasOffset = /Z$|[+-]\d{2}:\d{2}$/.test(iso);
  return new Date(hasOffset ? iso : `${iso}Z`);
}

/** Formats a backend timestamp in IST, regardless of the viewer's own device timezone. */
export function formatIST(iso: string, options: Intl.DateTimeFormatOptions): string {
  return parseUtcTimestamp(iso).toLocaleString(undefined, { ...options, timeZone: IST_TIMEZONE });
}

/**
 * Relative time (e.g. "5 minutes ago"). The duration itself is timezone-
 * independent (it's just a difference between two instants), so only the
 * UTC-parsing fix matters here — IST only affects the absolute-date fallback.
 */
export function getRelativeTime(iso: string): string {
  const date = parseUtcTimestamp(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  }

  return formatIST(iso, { month: "short", day: "numeric" });
}
