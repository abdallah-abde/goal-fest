import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalCleanSheetsProps } from "@/types/totalStats";
import { Badge } from "@/components/ui/badge";

export default function TotalCleanSheetsCard({
  teamsCleanSheets,
  label,
}: {
  teamsCleanSheets: TotalCleanSheetsProps[];
  label: string;
}) {
  return (
    <Card className='flex-1 min-w-80 bg-primary/10 text-primary'>
      <CardHeader className='p-3 text-center'>
        <CardTitle className='text-lg'>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {teamsCleanSheets.map((team) => (
          <div
            key={team.teamId}
            className='flex justify-between border-b border-primary/10 py-2 last:border-0'
          >
            <div className='flex gap-4 items-center'>
              <Image
                src={team.teamFlagUrl}
                alt={team.teamName}
                width={25}
                height={25}
              />
              <span>{team.teamName}</span>
            </div>
            <Badge variant='outline' className='text-sm'>
              {(
                team.groupMatchCleanSheets + team.knockoutMatchCleanSheets
              ).toString()}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
