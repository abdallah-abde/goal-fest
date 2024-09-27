"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ArrowDownAZ, ArrowDownZA, ArrowDownUp } from "lucide-react";

import { SortDirectionOptions } from "@/types/enums";

export default function SortComponent({
  label = "Name",
  labelForSmallerDevices,
  fieldName,
  direction = SortDirectionOptions.ASC,
}: {
  label?: string;
  labelForSmallerDevices?: string | null;
  fieldName: string;
  direction?: SortDirectionOptions | null;
}) {
  const [sortDirection, setSortDirection] =
    useState<SortDirectionOptions | null>(direction);
  // const [sortField, setSortField] = useState<String>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSort = (sortDir: SortDirectionOptions, sortField: string) => {
    setSortDirection(sortDir);
    const params = new URLSearchParams(searchParams);
    params.set("sortDir", sortDir);
    params.set("sortField", sortField);
    replace(`${pathname}?${params.toString()}`);
  };

  const iconStyles =
    "p-1 cursor-pointer rounded-full hover:bg-secondary hover:text-primary transition duration-200";

  return (
    <div className='flex gap-2 items-center w-full'>
      {labelForSmallerDevices && (
        <span className='hidden max-sm:block'>{labelForSmallerDevices}</span>
      )}
      <span className={`${labelForSmallerDevices ? "hidden sm:block" : ""}`}>
        {label}
      </span>
      {sortDirection === SortDirectionOptions.ASC && (
        <ArrowDownZA
          size='24'
          className={iconStyles}
          onClick={() => {
            // setSortDirection(SortDirectionValues.DESC);
            // setSortField(fieldName);
            handleSort(SortDirectionOptions.DESC, fieldName);
          }}
        />
      )}
      {sortDirection === SortDirectionOptions.DESC && (
        <ArrowDownAZ
          size='24'
          className={iconStyles}
          onClick={() => {
            // setSortDirection(SortDirectionValues.ASC);
            // setSortField(fieldName);
            handleSort(SortDirectionOptions.ASC, fieldName);
          }}
        />
      )}
    </div>
  );
}
