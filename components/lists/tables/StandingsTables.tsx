import Image from "next/image";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { StandingTeams } from "@/types";
import { sortGroupTeams } from "@/lib/sortGroupTeams";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";

import {
  LeagueGroup,
  League,
  LeagueSeason,
  TournamentEdition,
  Tournament,
  Group,
} from "@prisma/client";
import StandingTableHeader from "@/components/table-parts/StandingTableHeader";
import { standingsHeaders } from "@/lib/data/standingsHeaders";

interface TournamentEditionProps extends TournamentEdition {
  tournament: Tournament;
  groups: Group[];
}

interface LeagueSeasonProps extends LeagueSeason {
  league: League;
  groups: LeagueGroup[];
}

export default function StandingsTables({
  editionOrSeason,
  standings,
  type,
}: {
  editionOrSeason: TournamentEditionProps | LeagueSeasonProps;
  standings: StandingTeams[];
  type: "tournaments" | "leagues";
}) {
  return (
    <>
      <PageHeader
        label={
          type === "tournaments"
            ? `${
                (editionOrSeason as TournamentEditionProps)?.tournament.name
              } ${editionOrSeason?.year} Standings`
            : `${(editionOrSeason as LeagueSeasonProps)?.league.name} ${
                editionOrSeason?.year
              } Standings`
        }
      />

      {standings.length > 0 ? (
        <div className="mb-8 last:mb-0">
          <Table className="dark:border-primary/10 border">
            <StandingTableHeader values={standingsHeaders} />
            <TableBody>
              {standings.sort(sortGroupTeams).map((team) => (
                <TableRow key={team.id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell text-left flex gap-3 items-center">
                    {team.flagUrl && (
                      <>
                        <Image
                          src={team.flagUrl}
                          width={20}
                          height={20}
                          alt={`${team.name} flag`}
                          className="hidden max-xs:block"
                        />
                        <Image
                          src={team.flagUrl}
                          width={25}
                          height={25}
                          alt={`${team.name} flag`}
                          className="hidden xs:block"
                        />
                      </>
                    )}
                    <span className="hidden max-2xs:block">
                      {team.code ? team.code : team.name}
                    </span>
                    <span className="hidden 2xs:block">{team.name}</span>
                  </TableCell>
                  <TableCell className="py-4">{team.stats.played}</TableCell>
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
                  <TableCell className="py-4">{team.stats.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <NoDataFoundComponent message="Sorry, No Standings Found" />
      )}
    </>
  );
}
