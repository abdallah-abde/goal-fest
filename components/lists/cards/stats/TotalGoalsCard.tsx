import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TotalGoalsProps } from "@/types/totalStats";
import { Badge } from "@/components/ui/badge";

export default function TotalGoalsCard({
  teamsGoals,
  label,
}: // type
{
  teamsGoals: TotalGoalsProps[];
  label: string;
  // type: 'tournaments' | 'leagues'
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[16px] text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {teamsGoals.map(
          ({
            teamId,
            teamFlagUrl,
            teamName,
            teamCode,
            groupMatchesGoals,
            knockoutMatchesGoals,
          }) => (
            <div
              key={teamId}
              className="flex justify-between border-b border-primary/10 py-2 last:border-0"
            >
              <div className="flex gap-4 items-center">
                {teamFlagUrl && (
                  <Image
                    src={teamFlagUrl}
                    alt={teamName}
                    width={25}
                    height={25}
                  />
                )}
                <span className="hidden sm:block font-bold">{teamName}</span>
                <span className="hidden max-sm:block font-bold">
                  {teamCode}
                </span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {(groupMatchesGoals + knockoutMatchesGoals).toString()}
              </Badge>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
