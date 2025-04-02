"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import _ from "lodash";

import { cn } from "@/lib/utils";
import { sortGroupTeams } from "@/lib/sortGroupTeams";

import useGeoLocation from "@/hooks/useGeoLocation";

import { TableHeadProps, TeamWithStats } from "@/types";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import StandingTableHeader from "@/components/table-parts/StandingTableHeader";
import PartsLink from "@/app/(pages)/_components/PartsLink";

import { GroupsSkeleton, LoadingSpinner } from "@/components/Skeletons";
import { EmptyImageUrls } from "@/types/enums";
import RenderTitleBar from "@/app/(pages)/_components/RenderTitleBar";
import NoDataToShow from "@/app/(pages)/_components/NoDataToShow";

interface SeasonProps {
  id: number;
  year: string;
  flagUrl: string | null;
  slug: string;
  league: {
    name: string;
    flagUrl: string | null;
    isClubs: boolean;
    isDomestic: boolean;
  };
}

interface StandingProps {
  groupName: string | null;
  groupId: number | null;
  seasonId: number;
  teams: TeamWithStats[];
}

export default function Standings({
  values,
  date,
}: {
  values: TableHeadProps[];
  date: string;
}) {
  const [seasons, setSeasons] = useState<Array<SeasonProps>>(
    new Array<SeasonProps>()
  );

  const [standings, setStandings] = useState<Array<StandingProps>>([]);

  const [record, setRecord] = useState<SeasonProps | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isStandingsLoading, setIsStandingsLoading] = useState(true);
  const [showStandings, setShowStandings] = useState(true);

  const { location, loading: geoLocationLoading, error } = useGeoLocation();

  useEffect(() => {
    async function getStandings() {
      setIsStandingsLoading(true);
      if (record) {
        try {
          const res = await fetch(`/api/season-standings/${record.slug}`);
          const data = await res.json();

          setStandings(data);

          setIsStandingsLoading(false);
        } catch (error) {
          console.error(error);
          setIsStandingsLoading(false);
        }
      } else {
        setStandings([]);
      }
    }

    getStandings();
  }, [record]);

  useEffect(() => {
    async function getLeagues() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/seasons/${date}/${location?.country}`);
        const data = await res.json();

        setSeasons(data);

        if (data.length > 0) {
          setRecord(data[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    getLeagues();
  }, [date, location?.country]);

  if (isLoading || geoLocationLoading)
    return <GroupsSkeleton text="Loading Standings..." numberOfTables={1} />;

  if (seasons.length === 0)
    return (
      <div className="space-y-2">
        <RenderTitleBar
          showSection={showStandings}
          setShowSection={setShowStandings}
          title="Standings"
          hideTooltipText="Hide Standings"
          showTooltipText="Show Standings"
        />
        {showStandings && <NoDataToShow message="No Standings Found" />}
      </div>
    );

  return (
    <div className="space-y-2">
      {/* Most important today League table */}
      <RenderTitleBar
        showSection={showStandings}
        setShowSection={setShowStandings}
        title="Standings"
        hideTooltipText="Hide Standings"
        showTooltipText="Show Standings"
      />
      {showStandings && (
        <div className="w-full p-2 bg-primary/10 flex flex-col gap-2">
          <div className=" w-full gap-2 flex items-center text-xs">
            {seasons.map((rec, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => setRecord(rec)}
                disabled={rec === record}
              >
                {rec.league.name}
              </Button>
            ))}
          </div>
          {!isStandingsLoading ? (
            <>
              {standings &&
                standings.length > 0 &&
                standings.slice(0, 2).map((standing) => (
                  <Table
                    key={standing.seasonId}
                    className="dark:border-primary/10 border"
                  >
                    {standing.groupId !== null && (
                      <TableCaption
                        className={cn(
                          "bg-primary/20 text-foreground text-[16px] font-normal dark:border-primary/10 py-4"
                        )}
                      >
                        <div className=" flex items-center justify-between w-full px-2">
                          <p className="text-muted-foreground text-sm font-bold">
                            {standing.groupName}
                          </p>
                        </div>
                      </TableCaption>
                    )}
                    {standing.teams.length > 0 && (
                      <StandingTableHeader values={values} />
                    )}
                    <TableBody>
                      {standing.teams
                        .sort(sortGroupTeams)
                        .slice(0, 10)
                        .map((stand, idx) => (
                          <TableRow key={idx} className="dashboard-table-row">
                            <TableCell className="text-left flex gap-2 items-center py-1">
                              <>
                                <Image
                                  src={stand.flagUrl || EmptyImageUrls.Team}
                                  width={35}
                                  height={35}
                                  alt={`${stand.name} flag`}
                                  className="hidden max-xs:block aspect-video object-contain"
                                />
                                <Image
                                  src={stand.flagUrl || EmptyImageUrls.Team}
                                  width={50}
                                  height={50}
                                  alt={`${stand.name} flag`}
                                  className="hidden xs:block aspect-video object-contain"
                                />
                              </>
                              <span className="hidden max-2xs:block">
                                {stand.code || ""}
                              </span>
                              <span className="hidden 2xs:block">
                                {stand.name}
                              </span>
                            </TableCell>
                            <TableCell className="py-0">
                              {stand.stats.played}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-0">
                              {stand.stats.won}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-0">
                              {stand.stats.lost}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-0">
                              {stand.stats.draw}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-0">
                              {stand.stats.goalsFor}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell py-0">
                              {stand.stats.goalsAgainst}
                            </TableCell>
                            <TableCell className="py-0">
                              {stand.stats.goalsFor - stand.stats.goalsAgainst}
                            </TableCell>
                            <TableCell className="py-0">
                              {stand.stats.points}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ))}
              {record && !isStandingsLoading && (
                <PartsLink
                  href={`/league/${record?.slug}/standings`}
                  label="See More"
                />
              )}
            </>
          ) : (
            <div className="flex gap-2 items-center">
              <LoadingSpinner />
              <span>{`Loading ${record?.league.name} Standings...`}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
