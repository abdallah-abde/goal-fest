import prisma from "@/lib/db";

import Image from "next/image";

import {
  Table,
  TableCaption,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import StandingTableHeader from "@/components/table-parts/StandingTableHeader";

import { cn } from "@/lib/utils";

import _ from "lodash";

interface TableHeadProps {
  labels: Array<{ name: string; className?: string | null }>;
  className: string;
}

export default async function Standings({
  values,
  date,
}: {
  values: TableHeadProps[];
  date: Array<string | Date>;
}) {
  const [startDate, endDate] = date;

  const standings = await prisma.standing.findMany({
    where: {
      season: {
        matches: { some: { date: { gte: startDate, lte: endDate } } },
      },
    },
    include: {
      season: { include: { league: true } },
      team: true,
    },
  });

  const results = Object.entries(_.groupBy(standings, "seasonId"));

  console.log(results);

  return (
    <div className="space-y-2">
      {/* Most important today League table */}
      {results.map(([divier, list], idx) => (
        <Table key={idx} className="dark:border-primary/10 border">
          <TableCaption
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
          </TableCaption>
          <StandingTableHeader values={values} />
          <TableBody>
            {list.map((stand, idx) => (
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
                  <span className="hidden 2xs:block">{stand.team.name}</span>
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
      ))}
    </div>
  );
}
