export const getFormattedDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getFormattedTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getFormattedDateTime = (date: string) => {
  return `${getFormattedDate(date)}, ${new Date(date).toLocaleTimeString(
    "en-US",
    { hour: "numeric", minute: "numeric" }
  )}`;
};

export const getUTCDateValueForDateTimeInput = (date: Date) => {
  let [datePart, timePart] = date.toISOString().split("T");

  timePart = timePart.split(".")[0];
  const hh = timePart.split(":")[0];
  const mm = timePart.split(":")[1];

  return `${datePart}T${hh}:${mm}`;
};
