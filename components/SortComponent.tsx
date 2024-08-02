"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

import { ArrowDownAZ, ArrowDownZA, ArrowDownUp } from "lucide-react";

import { SortDirectionValues } from "@/typings/sortValues";

export default function SortComponent({
  label = "Name",
  fieldName,
  direction = SortDirectionValues.ASC,
}: {
  label?: string;
  fieldName: string;
  direction?: SortDirectionValues | null;
}) {
  const [sortDirection, setSortDirection] =
    useState<SortDirectionValues | null>(direction);
  // const [sortField, setSortField] = useState<String>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSort = (sortDir: SortDirectionValues, sortField: string) => {
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
      <span>{label}</span>
      {sortDirection === SortDirectionValues.ASC && (
        <ArrowDownZA
          size='24'
          className={iconStyles}
          onClick={() => {
            // setSortDirection(SortDirectionValues.DESC);
            // setSortField(fieldName);
            handleSort(SortDirectionValues.DESC, fieldName);
          }}
        />
      )}
      {sortDirection === SortDirectionValues.DESC && (
        <ArrowDownAZ
          size='24'
          className={iconStyles}
          onClick={() => {
            // setSortDirection(SortDirectionValues.ASC);
            // setSortField(fieldName);
            handleSort(SortDirectionValues.ASC, fieldName);
          }}
        />
      )}
    </div>
  );
}
