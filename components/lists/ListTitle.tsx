import { getFormattedDate } from "@/lib/getFormattedDate";

export default function ListTitle({
  groupBy,
  divider,
  isSmall,
}: {
  groupBy: string;
  divider: string;
  isSmall: boolean;
}) {
  return (
    <p className='text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
      {groupBy === "onlyDate"
        ? divider === ""
          ? "Matches without date"
          : getFormattedDate(divider, !isSmall)
        : divider === "null"
        ? "Matches without round"
        : divider}
    </p>
  );
}
