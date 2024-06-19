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

const EditionGroupList: FC<Props> = ({ groupsWithTeams }) => {
  return (
    <>
      {groupsWithTeams.length > 0 ? (
        groupsWithTeams.map((group) => (
          <>
            {group.teams.length > 0 ? (
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
                  {group.teams
                    .sort((a, b) => {
                      if (a.stats.points > b.stats.points) {
                        return -1;
                      } else if (a.stats.points < b.stats.points) {
                        return 1;
                      } else {
                        if (a.stats.goalDifference > b.stats.goalDifference) {
                          return -1;
                        } else if (
                          a.stats.goalDifference < b.stats.goalDifference
                        ) {
                          return 1;
                        } else {
                          if (a.stats.goalsFor > b.stats.goalsFor) {
                            return -1;
                          } else if (a.stats.goalsFor < b.stats.goalsFor) {
                            return 1;
                          } else return 0;
                        }
                      }
                    })
                    .map((team) => (
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
            ) : (
              <p>No Data Found</p>
            )}
          </>
        ))
      ) : (
        <p>No Data Found</p>
      )}
    </>
  );
};

export default EditionGroupList;
