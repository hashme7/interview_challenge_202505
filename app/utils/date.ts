const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

/**
 * Format a date to a readable string (e.g., "Jan 15, 2024, 3:30 PM")
 */
export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      console.warn("Invalid date provided to formatDate:", date);
      return "Invalid date";
    }
    return DATE_FORMATTER.format(dateObj);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid date";
  }
}

/**
 * Format a date to a relative string (e.g., "2 days ago", "just now")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "Invalid date";

  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

  const thresholds = {
    minute: 60,
    hour: 60 * 60,
    day: 60 * 60 * 24,
    month: 60 * 60 * 24 * 30,
  };

  const absDiff = Math.abs(diffInSeconds);

  if (absDiff >= thresholds.month) {
    return formatDate(dateObj);
  } else if (absDiff >= thresholds.day) {
    return RELATIVE_FORMATTER.format(
      Math.round(diffInSeconds / thresholds.day),
      "day"
    );
  } else if (absDiff >= thresholds.hour) {
    return RELATIVE_FORMATTER.format(
      Math.round(diffInSeconds / thresholds.hour),
      "hour"
    );
  } else if (absDiff >= thresholds.minute) {
    return RELATIVE_FORMATTER.format(
      Math.round(diffInSeconds / thresholds.minute),
      "minute"
    );
  }

  return "just now";
}
