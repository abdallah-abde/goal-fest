"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Standing } from "@prisma/client";

import _ from "lodash";

import useGeoLocation from "@/hooks/useGeoLocation";

import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StandingTableHeader from "@/components/table-parts/StandingTableHeader";
import { LoadingSpinner } from "@/components/LoadingComponents";

import { sortStandings } from "@/lib/sortGroupTeams";

interface TableHeadProps {
  labels: Array<{ name: string; className?: string | null }>;
  className: string;
}

export default function Standings({
  values,
  date,
}: {
  values: TableHeadProps[];
  date: string;
}) {
  const [standings, setStandings] = useState<Array<Standing>>(
    new Array<Standing>()
  );
  const [isLoading, setIsLoading] = useState(true);
  const { location, loading, error } = useGeoLocation();

  useEffect(() => {
    async function getStandings() {
      try {
        const res = await fetch(`/api/standings/${date}/${location?.country}`);
        const data: Standing[] = await res.json();

        setStandings(data);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    getStandings();
  }, [date, location?.country]);

  if (isLoading || loading) return <LoadingSpinner />;

  if (standings.length === 0) return;

  const results = Object.entries(_.groupBy(standings, "seasonId"));

  return (
    <div className="space-y-2">
      {/* Most important today League table */}
      <Tabs defaultValue={results[0][0]} className="w-full">
        <TabsList className="bg-background w-full justify-start rounded-none">
          {results.map(([divider, list]: Array<any>, idx) => (
            <TabsTrigger key={divider} value={divider}>
              {list[0].season.league.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {results.map(([divider, list], idx) => (
          <TabsContent key={divider} value={divider}>
            <Table className="dark:border-primary/10 border">
              {/* <TableCaption
                className={cn(
                  "bg-primary/20 text-foreground text-[16px] font-normal dark:border-primary/10 py-4"
                )}
              >
                <div className=" flex items-center justify-between w-full px-2">
                  <p className="text-lg">{list[0].season.league.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {list[0].season.year}
                  </p>
                </div>
              </TableCaption> */}
              <StandingTableHeader values={values} />
              <TableBody>
                {list
                  .sort(sortStandings)
                  .slice(0, 10)
                  .map((stand: any, idx) => (
                    <TableRow key={idx} className="dashboard-table-row">
                      <TableCell className="text-left flex gap-3 items-center py-1">
                        {stand.team.flagUrl && (
                          <>
                            <Image
                              src={stand.team.flagUrl}
                              width={20}
                              height={20}
                              alt={`${stand.team.name} flag`}
                              className="hidden max-xs:block"
                            />
                            <Image
                              src={stand.team.flagUrl}
                              width={25}
                              height={25}
                              alt={`${stand.team.name} flag`}
                              className="hidden xs:block"
                            />
                          </>
                        )}
                        <span className="hidden max-2xs:block">
                          {stand.team.code || ""}
                        </span>
                        <span className="hidden 2xs:block">
                          {stand.team.name}
                        </span>
                      </TableCell>
                      <TableCell className="py-0">{stand.played}</TableCell>
                      <TableCell className="hidden sm:table-cell py-0">
                        {stand.won}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-0">
                        {stand.lost}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-0">
                        {stand.drawn}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-0">
                        {stand.goalsFor}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-0">
                        {stand.goalsAgainst}
                      </TableCell>
                      <TableCell className="py-0">
                        {stand.goalsFor - stand.goalsAgainst}
                      </TableCell>
                      <TableCell className="py-0">{stand.points}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
