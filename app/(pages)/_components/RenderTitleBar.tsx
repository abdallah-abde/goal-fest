import { Dispatch, SetStateAction } from "react";
import PartsTitle from "@/app/(pages)/_components/PartsTitle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function RenderTitleBar({
  showSection,
  setShowSection,
  title,
  hideTooltipText,
  showTooltipText,
}: {
  showSection: boolean;
  setShowSection: Dispatch<SetStateAction<boolean>>;
  title: string;
  hideTooltipText: string;
  showTooltipText: string;
}) {
  return (
    <div className="flex justify-between items-end">
      <PartsTitle title={title} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-primary/10"
              asChild
              onClick={() => setShowSection(!showSection)}
            >
              {showSection ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {showSection ? hideTooltipText : showTooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
