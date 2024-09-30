export function getFormattedDate(date: string, short: boolean = false) {
  return new Date(date).toLocaleDateString("en-US", {
    year: short ? "2-digit" : "numeric",
    month: short ? "short" : "long",
    day: "numeric",
  });
}

export function getFormattedTime(
  date: string,
  short: boolean = false,
  dayPeriod: boolean = true
) {
  return new Date(date).toLocaleTimeString(short ? "it-IT" : "en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: dayPeriod,
  });
}

export function getFormattedDateTime(date: string, short: boolean = false) {
  return `${getFormattedDate(date, short)}; ${getFormattedTime(date, short)}`;
}

export function getUTCDateValueForDateTimeInput(date: Date) {
  let [datePart, timePart] = date.toISOString().split("T");

  timePart = timePart.split(".")[0];
  const hh = timePart.split(":")[0];
  const mm = timePart.split(":")[1];

  return `${datePart}T${hh}:${mm}`;
}

export function getDateValueForDateTimeInput(date: Date) {
  const [datePart, timePart] = date
    .toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
    })
    .split(",");

  const [month, day, year] = datePart.split("/");
  const [time, period] = timePart.trim().split(" ");
  const [hours, minutes] = time.split(":");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
