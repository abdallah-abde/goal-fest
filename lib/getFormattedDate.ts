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

export function convertUTCDateToLocalDate(date: Date, isStart: boolean) {
  let val = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
  if (!isStart) {
    val = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
  }
  var newDate = new Date(val);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours + offset);

  return newDate;
}

export function getStartAndEndDates(date: string) {
  const startDate = convertUTCDateToLocalDate(
    new Date(`${date}T00:00:00.000Z`),
    true
  );
  const endDate = convertUTCDateToLocalDate(
    new Date(`${date}T23:59:59.999Z`),
    false
  );

  return { startDate, endDate };
}

export function getDateAsShortDate(date: Date = new Date()) {
  const [month, day, year] = date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .split("/");

  return `${year}-${month}-${day}`;
}
