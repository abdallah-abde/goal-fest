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
import Image from "next/image";

interface Props {
  groupsWithTeams: GroupWithTeams[];
}

const EditionGroupList: FC<Props> = ({ groupsWithTeams }) => {
  return (
    <>
      {groupsWithTeams.length > 0 ? (
        groupsWithTeams.map((group) => (
          <div className='mb-4'>
            {group.teams.length > 0 ? (
              <Table>
                <TableCaption>{group.name}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[20%] text-left'>Name</TableHead>
                    <TableHead className='w-[10%]'>Played</TableHead>
                    <TableHead className='w-[10%]'>Won</TableHead>
                    <TableHead className='w-[10%]'>Lost</TableHead>
                    <TableHead className='w-[10%]'>Draw</TableHead>
                    <TableHead className='w-[10%]'>Goals For</TableHead>
                    <TableHead className='w-[10%]'>Goals Against</TableHead>
                    <TableHead className='w-[10%]'>Goal Difference</TableHead>
                    <TableHead className='w-[10%]'>Points</TableHead>
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
                        <TableCell className='text-left flex gap-3 items-center'>
                          <Image
                            src={`/teams/${team.flagUrl}`}
                            width={25}
                            height={25}
                            alt={`${team.name} flag`}
                          />
                          {team.name}
                        </TableCell>
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
          </div>
        ))
      ) : (
        <p>No Data Found</p>
      )}
    </>
  );
};

export default EditionGroupList;
