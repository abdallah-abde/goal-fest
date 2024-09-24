import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TeamOrCountryCard({
  id,
  name,
  flagUrl,
}: {
  id: number;
  name: string;
  flagUrl?: string | null;
}) {
  return (
    <Card
      key={id}
      className="bg-primary/10 flex flex-col-reverse justify-between items-center"
    >
      <CardHeader className="flex flex-row items-center justify-center">
        <CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-lg font-bold text-center truncate w-[10ch]">
                  {name}
                </p>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-0">
        {flagUrl && (
          <Image width={40} height={40} src={flagUrl} alt={name + " Flag"} />
        )}
      </CardContent>
    </Card>
  );
}
