"use client";

import { SortValues } from "@/typings/sortValues";
import { ArrowDownAZ, ArrowDownZA } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SortComponent({ label = "Name" }: { label?: string }) {
  const [sortOption, setSortOption] = useState<SortValues>(SortValues.ASC);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSort = (sort: SortValues) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    replace(`${pathname}?${params.toString()}`);
  };

  const iconStyles =
    "p-1 cursor-pointer rounded-full hover:bg-secondary hover:text-primary transition duration-200";

  return (
    <>
      <span>{label}</span>
      {sortOption === SortValues.ASC && (
        <ArrowDownZA
          size='24'
          className={iconStyles}
          onClick={() => {
            setSortOption(SortValues.DESC);
            handleSort(SortValues.DESC);
          }}
        />
      )}
      {sortOption === SortValues.DESC && (
        <ArrowDownAZ
          size='24'
          className={iconStyles}
          onClick={() => {
            setSortOption(SortValues.ASC);
            handleSort(SortValues.ASC);
          }}
        />
      )}
    </>
  );
}
