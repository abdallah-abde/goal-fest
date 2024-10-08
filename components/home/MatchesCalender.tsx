"use client";

import { ChangeEvent, useRef } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";

import { getDateAsShortDate } from "@/lib/getFormattedDate";

export default function MatchesCalender() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params = new URLSearchParams(searchParams);

  const date = params.get("date") || getDateAsShortDate();

  function changeParamsAndPush(date: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("date", date);
    router.push(`${pathname}?${newParams.toString()}`);
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    changeParamsAndPush(e.target.value);
  };

  const dateRef = useRef<HTMLInputElement>(null);

  function changeDate(isNext: boolean) {
    const tempDate = new Date(dateRef.current?.value || "");

    if (!isNext) {
      tempDate.setDate(tempDate.getDate() - 1);
    } else {
      tempDate.setDate(tempDate.getDate() + 1);
    }

    changeParamsAndPush(getDateAsShortDate(tempDate));
  }

  return (
    <div className="w-full bg-primary/10 h-[50px] flex items-center justify-between">
      <ChevronLeft
        className="cursor-pointer hover:bg-secondary/75 w-7 h-full transition duration-300"
        onClick={() => {
          changeDate(false);
        }}
      />
      <Input
        type="date"
        name="date"
        onChange={handleDateChange}
        value={date}
        className="bg-transparent border-none text-center cursor-pointer w-fit"
        ref={dateRef}
      />
      <ChevronRight
        className="cursor-pointer hover:bg-secondary/75 w-7 h-full transition duration-300"
        onClick={() => {
          changeDate(true);
        }}
      />
    </div>
  );
}
