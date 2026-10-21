// Small helpers for showing launch data. They have no React in them,
// so they can be tested with Node's built-in test runner.

// Turn "2026-10-20T10:30:00Z" into a readable local date and time.
// Anything that is not a valid date is shown as "Date not set".
export function formatDate(value) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "Date not set";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });
}

// The best webcast link Launch Library knows about, or null if none yet.
// Launch Library lists them in vid_urls; a lower priority number comes first.
export function bestWebcast(launch) {
  const videos = Array.isArray(launch?.vid_urls) ? launch.vid_urls : [];
  const withUrl = videos.filter(v => v && v.url);
  if (!withUrl.length) return null;
  return [...withUrl].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))[0].url;
}

// Read the JSON from a fetch response, or throw with the HTTP status
// so the page can show a clear message instead of a blank screen.
export async function readJson(response) {
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
