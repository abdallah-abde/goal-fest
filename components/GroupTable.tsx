import { GroupWithTeams } from "@/typings";
import { FC } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  groupsWithTeams: GroupWithTeams[];
}

const GroupTable: FC<Props> = ({ groupsWithTeams }) => {
  return (
    <>
      {groupsWithTeams.map((group) => (
        <>
          {group.teams.length > 0 && (
            <Table>
              <TableCaption>{group.name}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Played</TableHead>
                  <TableHead>Won</TableHead>
                  <TableHead>Lost</TableHead>
                  <TableHead>Draw</TableHead>
                  <TableHead>Goals For</TableHead>
                  <TableHead>Goals Against</TableHead>
                  <TableHead>Goal Difference</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell>{team.name}</TableCell>
                    <TableCell>{team.stats.played}</TableCell>
                    <TableCell>{team.stats.won}</TableCell>
                    <TableCell>{team.stats.lost}</TableCell>
                    <TableCell>{team.stats.draw}</TableCell>
                    <TableCell>{team.stats.goalsFor}</TableCell>
                    <TableCell>{team.stats.goalsAgainst}</TableCell>
                    <TableCell>{team.stats.goalDifference}</TableCell>
                    <TableCell>{team.stats.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      ))}
    </>
  );
};

export default GroupTable;
