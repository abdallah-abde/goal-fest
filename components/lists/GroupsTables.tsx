import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { GroupWithTeams } from "@/typings";
import { sortGroupTeams } from "@/lib/sortGroupTeams";

import NoDataFoundComponent from "@/components/NoDataFoundComponent";

export default function GroupsTables({
  groupsWithTeams,
}: {
  groupsWithTeams: GroupWithTeams[];
}) {
  return (
    <>
      {groupsWithTeams.length > 0 ? (
        groupsWithTeams.map((group) => (
          <div key={group.id} className='mb-8 last:mb-0'>
            <Table className='dark:border-primary/10 border-0'>
              <TableCaption
                className={cn(
                  "bg-primary/20 text-foreground text-[16px] font-normal dark:border-primary/10"
                )}
              >
                {group.name}
              </TableCaption>
              {group.teams.length > 0 ? (
                <>
                  <TableHeader>
                    <TableRow className='bg-primary/10 hover:bg-primary/10 border-0'>
                      <TableHead className='min-w-[150px] max-2xs:min-w-[100px] text-left'>
                        Team
                      </TableHead>
                      <TableHead className='w-1/12 max-xs:w-1/6 max-sm:w-1/3 text-center'>
                        <span className='hidden max-xs:block'>P</span>
                        <span className='hidden xs:block'>Played</span>
                      </TableHead>
                      <TableHead className='w-1/12 hidden sm:table-cell'>
                        <span>W</span>
                      </TableHead>
                      <TableHead className='w-1/12 hidden sm:table-cell'>
                        <span>L</span>
                      </TableHead>
                      <TableHead className='w-1/12 hidden sm:table-cell'>
                        <span>D</span>
                      </TableHead>
                      <TableHead className='w-1/12 hidden sm:table-cell'>
                        <span>GF</span>
                      </TableHead>
                      <TableHead className='w-1/12 hidden sm:table-cell'>
                        <span>GA</span>
                      </TableHead>
                      <TableHead className='w-1/12 max-xs:w-1/6 max-sm:w-1/3'>
                        <span>+/-</span>
                      </TableHead>
                      <TableHead className='w-1/12 max-xs:w-1/6 max-sm:w-1/3'>
                        <span className='hidden max-xs:block'>Pts</span>
                        <span className='hidden xs:block'>Points</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.teams.sort(sortGroupTeams).map((team) => (
                      <TableRow
                        key={team.id}
                        className='border-b-[1px] border-b-primary/10'
                      >
                        <TableCell className='text-left flex gap-3 items-center font-bold '>
                          {team.flagUrl && (
                            <>
                              <Image
                                src={team.flagUrl}
                                width={20}
                                height={20}
                                alt={`${team.name} flag`}
                                className='hidden max-xs:block'
                              />
                              <Image
                                src={team.flagUrl}
                                width={25}
                                height={25}
                                alt={`${team.name} flag`}
                                className='hidden xs:block'
                              />
                            </>
                          )}
                          <span className='hidden max-2xs:block'>
                            {team.name.substring(0, 3)}
                          </span>
                          <span className='hidden 2xs:block'>{team.name}</span>
                        </TableCell>
                        <TableCell>{team.stats.played}</TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {team.stats.won}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {team.stats.lost}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {team.stats.draw}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {team.stats.goalsFor}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          {team.stats.goalsAgainst}
                        </TableCell>
                        <TableCell>{team.stats.goalDifference}</TableCell>
                        <TableCell>{team.stats.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              ) : (
                <p className='text-primary font-bold py-2 text-center'>
                  There is no Teams in {group.name}
                </p>
              )}
            </Table>
          </div>
        ))
      ) : (
        <NoDataFoundComponent message='Sorry, No Groups Found' />
      )}
    </>
  );
}
