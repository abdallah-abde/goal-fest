"use client";

import { getFormattedDate } from "@/lib/getFormattedDate";

export default function ListTitle({
  groupBy,
  divider,
}: {
  groupBy: string;
  divider: string;
}) {
  return (
    <>
      <p className='hidden sm:block text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
        {groupBy === "onlyDate"
          ? divider === ""
            ? "Matches without date"
            : getFormattedDate(divider)
          : divider === "null"
          ? "Matches without round"
          : divider}
      </p>
      <p className='hidden max-sm:block text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold'>
        {groupBy === "onlyDate"
          ? divider === ""
            ? "Matches without date"
            : getFormattedDate(divider, true)
          : divider === "null"
          ? "Matches without round"
          : divider}
      </p>
    </>
  );
}
