import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import NotProvidedSpan from "@/components/NotProvidedSpan";

export default function DateTimeTableCell({ date }: { date?: Date | null }) {
  return (
    <div className="flex flex-col">
      <span className="hidden max-sm:block">
        {date ? (
          getFormattedDate(date.toString(), true)
        ) : (
          <NotProvidedSpan>
            Date: <span className="italic">#NP</span>
          </NotProvidedSpan>
        )}
      </span>
      <span className="hidden max-sm:block">
        {date ? (
          getFormattedTime(date.toString(), true, false)
        ) : (
          <NotProvidedSpan>
            Time: <span className="italic">#NP</span>
          </NotProvidedSpan>
        )}
      </span>
      <span className="hidden sm:block">
        {date ? (
          getFormattedDate(date.toString(), true)
        ) : (
          <NotProvidedSpan>
            Date: <span className="italic">#NP</span>
          </NotProvidedSpan>
        )}
      </span>
      <span className="hidden sm:block">
        {date ? (
          getFormattedTime(date.toString(), false, false)
        ) : (
          <NotProvidedSpan>
            Time: <span className="italic">#NP</span>
          </NotProvidedSpan>
        )}
      </span>
    </div>
  );
}
