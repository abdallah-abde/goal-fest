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

import { GroupWithTeams } from "@/types";
import { sortGroupTeams } from "@/lib/sortGroupTeams";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import GroupsFilterDialog from "@/components/lists/tables/GroupsFilterDialog";

import { Group, Tournament, TournamentEdition } from "@prisma/client";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  groups: Group[];
}

export default function GroupsTables({
  tournamentEdition,
  groupsWithTeams,
}: {
  tournamentEdition: TournamentEditionProps;
  groupsWithTeams: GroupWithTeams[];
}) {
  return (
    <>
      <PageHeader
        label={`${tournamentEdition?.tournament.name} ${tournamentEdition?.yearAsString} Groups`}
      />
      <div className='flex justify-end pb-2'>
        <GroupsFilterDialog groups={tournamentEdition.groups} />
      </div>
      {groupsWithTeams.length > 0 ? (
        groupsWithTeams.map((group) => (
          <div key={group.id} className='mb-8 last:mb-0'>
            <Table className='dark:border-primary/10 border'>
              <TableCaption
                className={cn(
                  "bg-primary/20 text-foreground text-[16px] font-normal dark:border-primary/10 py-4"
                )}
              >
                {group.name}
              </TableCaption>
              {group.teams.length > 0 ? (
                <>
                  <TableHeader>
                    <TableRow className='dashboard-head-table-row'>
                      <TableHead className='dashboard-head-table-cell min-w-[150px] max-2xs:min-w-[100px]'>
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
                      <TableRow key={team.id} className='dashboard-table-row'>
                        <TableCell className='dashboard-table-cell text-left flex gap-3 items-center'>
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
                            {team.code ? team.code : team.name}
                          </span>
                          <span className='hidden 2xs:block'>{team.name}</span>
                        </TableCell>
                        <TableCell className='py-4'>
                          {team.stats.played}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell py-4'>
                          {team.stats.won}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell py-4'>
                          {team.stats.lost}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell py-4'>
                          {team.stats.draw}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell py-4'>
                          {team.stats.goalsFor}
                        </TableCell>
                        <TableCell className='hidden sm:table-cell py-4'>
                          {team.stats.goalsAgainst}
                        </TableCell>
                        <TableCell className='py-4'>
                          {team.stats.goalDifference}
                        </TableCell>
                        <TableCell className='py-4'>
                          {team.stats.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              ) : (
                <p className='text-destructive font-bold py-2 text-center'>
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
