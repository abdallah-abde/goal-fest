"use client";

import { getFormattedDate } from "@/lib/getFormattedDate";
import { GroupByOptions } from "@/types/enums";

export default function ListTitle({
  groupBy,
  divider,
}: {
  groupBy: string;
  divider: string;
}) {
  function getDivider(forSmallDevices: boolean) {
    if (groupBy === GroupByOptions.ONLYDATE) {
      if (divider === "null") {
        return "Matches without date";
      } else {
        return getFormattedDate(divider, forSmallDevices);
      }
    } else if (groupBy === GroupByOptions.STAGE) {
      if (divider == null || divider == "") {
        return "Matches without round";
      } else {
        return divider;
      }
    } else {
      return "";
    }
  }

  return (
    <>
      <p
        className="hidden sm:block text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold"
        // id={getFormattedDate(divider) || "123"}
      >
        {getDivider(false)}
      </p>
      <p className="hidden max-sm:block text-[14px] sm:text-[16px] mb-2 border-2 border-primary/10 w-fit p-2 rounded-sm font-semibold">
        {getDivider(true)}
      </p>
    </>
  );
}
