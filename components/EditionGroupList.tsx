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
import { sortGroupTeams } from "@/lib/sortGroupTeams";
import { cn } from "@/lib/utils";

interface Props {
  groupsWithTeams: GroupWithTeams[];
}

const EditionGroupList: FC<Props> = ({ groupsWithTeams }) => {
  return (
    <div className='mb-24'>
      {groupsWithTeams.length > 0 ? (
        groupsWithTeams.map((group) => (
          <div key={group.id}>
            {group.teams.length > 0 ? (
              <Table className='mb-8'>
                <TableCaption className={cn("mx-0 text-left")}>
                  {group.name}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[20%] text-left'>Team</TableHead>
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
                  {group.teams.sort(sortGroupTeams).map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className='text-left flex gap-3 items-center font-bold'>
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
              <p>No Teams in {group.name} Found</p>
            )}
          </div>
        ))
      ) : (
        <p>No Groups Found</p>
      )}
    </div>
  );
};

export default EditionGroupList;
