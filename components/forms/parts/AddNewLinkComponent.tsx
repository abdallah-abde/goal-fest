import Link from "next/link";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AddNewLinkComponent({
  // href,
  label = "Add New",
}: // width = "min-w-48",
{
  // href: string;
  label?: string;
  // width?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          {/* <Link
            href={href}
            className={cn(
              "ml-auto flex items-center gap-2 text-sm border border-outline p-2 rounded-sm hover:bg-primary/10 transition duration-200"
              // width
            )}
          > */}
          <Plus className="size-5" />
          {/* <span className='self-center'>{label}</span> */}
          {/* </Link> */}
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
