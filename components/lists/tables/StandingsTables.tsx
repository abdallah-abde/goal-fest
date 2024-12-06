import Image from "next/image";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { StandingTeams } from "@/types";
import { sortGroupTeams } from "@/lib/sortGroupTeams";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";

import { League, Season, Group } from "@prisma/client";
import StandingTableHeader from "@/components/table-parts/StandingTableHeader";
import { standingsHeaders } from "@/lib/data/standingsHeaders";
import { EmptyImageUrls } from "@/types/enums";

interface SeasonProps extends Season {
  league: League;
  groups: Group[];
}

export default function StandingsTables({
  season,
  standings,
}: {
  season: SeasonProps;
  standings: StandingTeams[];
}) {
  return (
    <>
      <PageHeader label={`${season?.league.name} ${season?.year} Standings`} />

      {standings.length > 0 ? (
        <div className="mb-8 last:mb-0">
          <Table className="dark:border-primary/10 border">
            <StandingTableHeader values={standingsHeaders} />
            <TableBody>
              {standings.sort(sortGroupTeams).map((team) => (
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
