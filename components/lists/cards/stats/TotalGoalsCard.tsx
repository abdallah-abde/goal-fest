import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TournamentTotalGoalsProps } from "@/types/totalStats";
import { Badge } from "@/components/ui/badge";

export default function TotalGoalsCard({
  teamsGoals,
  label,
}: {
  teamsGoals: TournamentTotalGoalsProps[];
  label: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[16px] text-center">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {teamsGoals.map((team) => (
          <div
            key={team.teamId}
            className="flex justify-between border-b border-primary/10 py-2 last:border-0"
          >
            <div className="flex gap-4 items-center">
              {team.teamFlagUrl && (
                <Image
                  src={team.teamFlagUrl}
                  alt={team.teamName}
                  width={25}
                  height={25}
                />
              )}
              <span className="hidden sm:block font-bold">{team.teamName}</span>
              <span className="hidden max-sm:block font-bold">
                {team.teamCode}
              </span>
            </div>
            <Badge variant="secondary" className="text-sm">
              {(team.groupMatchesGoals + team.knockoutMatchesGoals).toString()}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
