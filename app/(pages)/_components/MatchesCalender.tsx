"use client";

import { useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { getDateAsShortDate } from "@/lib/getFormattedDate";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MatchesCalender() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // const params = new URLSearchParams(searchParams);

  // const date = params.get("date") || getDateAsShortDate();

  function changeParamsAndPush(date: string) {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("date", date);
    router.push(`${pathname}?${newParams.toString()}`);
  }

  function changeDate(isNext: boolean) {
    let newDate: number | undefined = undefined;

    if (!isNext) {
      newDate = date?.setDate(date?.getDate() - 1);
    } else {
      newDate = date?.setDate(date?.getDate() + 1);
    }

    newDate && changeParamsAndPush(getDateAsShortDate(new Date(newDate)));
  }

  return (
    <div className="w-full h-[50px] flex items-center justify-between">
      <Button variant="ghost" size="icon">
        <ChevronLeft
          className="cursor-pointer hover:bg-secondary-foreground/10 rounded-sm w-7 h-full transition duration-300"
          onClick={() => {
            changeDate(false);
          }}
        />
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-center text-center font-normal hover:bg-secondary-foreground/10 rounded-sm",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              changeParamsAndPush(getDateAsShortDate(date));
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {/* <Input
          type="date"
          name="date"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.value);
            changeParamsAndPush(e.target.value);
          }}
          value={date}
          className="bg-transparent border-none text-center cursor-pointer w-fit"
          ref={dateRef}
        /> */}
      <Button variant="ghost" size="icon">
        <ChevronRight
          className="cursor-pointer hover:bg-secondary-foreground/10 rounded-sm  w-7 h-full transition duration-300"
          onClick={() => {
            changeDate(true);
          }}
        />
      </Button>
    </div>
  );
}
