"use client";

import { SortDirectionOptions } from "@/types/enums";
import { ChevronDownCircle, ChevronUpCircle } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SortByList({
  list,
  defaultField,
}: {
  list: Array<{ label: string; fieldName: string }>;
  defaultField: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSortFieldClick = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortField", value);
    params.set("sortDir", currentSortDir);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSortDirChange = (value: SortDirectionOptions) => {
    const params = new URLSearchParams(searchParams);
    params.set("sortField", currentSortField);
    params.set("sortDir", value);
    replace(`${pathname}?${params.toString()}`);
  };

  const currentSortField = searchParams.get("sortField") || defaultField;
  const currentSortDir =
    searchParams.get("sortDir") || SortDirectionOptions.ASC;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative border border-dotted border-muted-foreground rounded-md">
          <span className="text-muted-foreground text-[10px] absolute -top-2 left-0 bg-muted ml-2 px-1">
            Sort by
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:border-background/0 focus-visible:border-2"
                >
                  {currentSortDir === SortDirectionOptions.ASC ? (
                    <ChevronUpCircle className="mr-2" size={15} />
                  ) : (
                    <ChevronDownCircle className="mr-2" size={15} />
                  )}{" "}
                  {list.find((a) => a.fieldName === currentSortField)?.label ||
                    "No Sort Option"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to Sort</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit flex gap-6">
        <div className="flex flex-col gap-2">
          {list.map((item, idx) => (
            <Button
              key={idx}
              onClick={() => handleSortFieldClick(item.fieldName)}
              variant={
                item.fieldName === currentSortField ? "outline" : "ghost"
              }
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div>
          <RadioGroup defaultValue={currentSortDir}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={SortDirectionOptions.ASC}
                id={SortDirectionOptions.ASC}
                onClick={() => handleSortDirChange(SortDirectionOptions.ASC)}
              />
              <Label htmlFor={SortDirectionOptions.ASC}>ASC</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={SortDirectionOptions.DESC}
                id={SortDirectionOptions.DESC}
                onClick={() => handleSortDirChange(SortDirectionOptions.DESC)}
              />
              <Label htmlFor={SortDirectionOptions.DESC}>DESC</Label>
            </div>
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
