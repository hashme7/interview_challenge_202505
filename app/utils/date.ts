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
  console.log("to local string", date.toLocaleString());
  // console.log("Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone);
  // console.log("Current time:", new Date().toLocaleString());
  // console.log("Current UTC:", new Date().toISOString());
  // console.log(`type of :${typeof date}`)
  
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const nowIST = new Date();
  const targetIST = new Date(formatter.format(dateObj));

  const diffInSeconds = Math.floor(
    (targetIST.getTime() - nowIST.getTime()) / 1000
  );
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (Math.abs(diffInDays) > 30) {
    console.log("diff in days greater than 30");
    
    return formatDate(dateObj);
  }

  if (Math.abs(diffInDays) > 0) {
    console.log("diff in days",diffInDays)
    return RELATIVE_FORMATTER.format(diffInDays, "day");
  }

  if (Math.abs(diffInHours) > 0) {
    console.log("diff in minutes..")
    return RELATIVE_FORMATTER.format(diffInHours, "hour");
  }

  if (Math.abs(diffInMinutes) > 0) {
    console.log("diff in minutes")
    return RELATIVE_FORMATTER.format(diffInMinutes, "minute");
  }

  return "just now";
}
