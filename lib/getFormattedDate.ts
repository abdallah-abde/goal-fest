export function getFormattedDate(date: string, short: boolean = false) {
  return new Date(date).toLocaleDateString("en-US", {
    year: short ? "2-digit" : "numeric",
    month: short ? "short" : "long",
    day: "numeric",
  });
}

export function getFormattedTime(date: string, short: boolean = false) {
  return new Date(date).toLocaleTimeString(short ? "it-IT" : "en-EN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getFormattedDateTime(date: string, short: boolean = false) {
  return `${getFormattedDate(date, short)}, ${
    getFormattedTime(date, short)
    // new Date(date).toLocaleTimeString(
    // short ? "it-IT" : "en-EN",
    // { hour: "2-digit", minute: "2-digit" }
    // )
  }`;
}

export function getUTCDateValueForDateTimeInput(date: Date) {
  let [datePart, timePart] = date.toISOString().split("T");

  timePart = timePart.split(".")[0];
  const hh = timePart.split(":")[0];
  const mm = timePart.split(":")[1];

  return `${datePart}T${hh}:${mm}`;
}
