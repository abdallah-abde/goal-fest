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

import { GroupWithTeams, LeagueGroupWithTeams } from "@/types";
import { sortGroupTeams } from "@/lib/sortGroupTeams";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import GroupsFilterDialog from "@/components/lists/tables/GroupsFilterDialog";

import {
  Group,
  Tournament,
  TournamentEdition,
  LeagueGroup,
  League,
  LeagueSeason,
} from "@prisma/client";
import StandingTableHeader from "@/components/table-parts/StandingTableHeader";
import { standingsHeaders } from "@/lib/data/standingsHeaders";
import { EmptyImageUrls } from "@/types/enums";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  groups: Group[];
}

interface LeagueSeasonProps extends LeagueSeason {
  league: League;
  groups: LeagueGroup[];
}

export default function GroupsTables({
  editionOrSeason,
  groupsWithTeams,
  type,
}: {
  editionOrSeason: TournamentEditionProps | LeagueSeasonProps;
  groupsWithTeams?: GroupWithTeams[] | LeagueGroupWithTeams[];
  type: "tournaments" | "leagues";
}) {
  return (
    <>
      <PageHeader
        label={
          type === "tournaments"
            ? `${
                (editionOrSeason as TournamentEditionProps)?.tournament.name
              } ${editionOrSeason?.year} Groups`
            : `${(editionOrSeason as LeagueSeasonProps)?.league.name} ${
                editionOrSeason?.year
              } Groups`
        }
      />
      <div className="flex justify-end pb-2">
        <GroupsFilterDialog groups={editionOrSeason.groups} />
      </div>
      {groupsWithTeams && groupsWithTeams.length > 1 ? (
        groupsWithTeams.map((group) => (
          <div key={group.id} className="mb-8 last:mb-0">
            <Table className="dark:border-primary/10 border">
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
                    <StandingTableHeader values={standingsHeaders} />
                  </TableHeader>
                  <TableBody>
                    {group.teams.sort(sortGroupTeams).map((team) => (
                      <TableRow key={team.id} className="dashboard-table-row">
                        <TableCell className="dashboard-table-cell text-left flex gap-3 items-center">
                          <>
                            <Image
                              src={team.flagUrl || EmptyImageUrls.Team}
                              width={30}
                              height={30}
                              alt={`${team.name} Flag` || "Team Flag"}
                              className="hidden max-xs:block aspect-video object-contain"
                            />
                            <Image
                              src={team.flagUrl || EmptyImageUrls.Team}
                              width={35}
                              height={35}
                              alt={`${team.name} Flag` || "Team Flag"}
                              className="hidden xs:block aspect-video object-contain"
                            />
                          </>
                          <span className="hidden max-2xs:block">
                            {team.code ? team.code : team.name}
                          </span>
                          <span className="hidden 2xs:block">{team.name}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          {team.stats.played}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4">
                          {team.stats.won}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4">
                          {team.stats.lost}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4">
                          {team.stats.draw}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4">
                          {team.stats.goalsFor}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4">
                          {team.stats.goalsAgainst}
                        </TableCell>
                        <TableCell className="py-4">
                          {team.stats.goalDifference}
                        </TableCell>
                        <TableCell className="py-4">
                          {team.stats.points}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </>
              ) : (
                <p className="text-destructive font-bold py-2 text-center">
                  There is no Teams in {group.name}
                </p>
              )}
            </Table>
          </div>
        ))
      ) : (
        <NoDataFoundComponent message="Sorry, No Groups Found" />
      )}
    </>
  );
}
