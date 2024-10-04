import prisma from "@/lib/db";

import Image from "next/image";

import { NeutralMatch } from "@/types";

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

import _ from "lodash";

import MatchesCalender from "@/components/home/MatchesCalender";
import CategorizedMatchesByDate from "@/components/home/CategorizedMatchesByDate";
import CategorizedMatchesByCountry from "@/components/home/CategorizedMatchesByCountry";
import FeaturedMatches from "@/components/home/FeaturedMatches";

import {
  switchGroupMatchesToNeutralMatches,
  switchKnockoutMatchesToNeutralMatches,
  switchLeagueMatchesToNeutralMatches,
} from "@/lib/data/switchers";

import {
  getStartAndEndDates,
  getDateAsShortDate,
} from "@/lib/getFormattedDate";

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    date: string;
  };
}) {
  const date = searchParams?.date || getDateAsShortDate();

  const { startDate, endDate } = getStartAndEndDates(date);

  const [matches, knockoutMatches, leagueMatches] = await Promise.all([
    prisma.match.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        tournamentEdition: {
          include: {
            tournament: true,
            hostingCountries: true,
          },
        },
        homeTeam: true,
        awayTeam: true,
        group: true,
      },
    }),
    prisma.knockoutMatch.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        tournamentEdition: {
          include: {
            tournament: true,
            hostingCountries: true,
          },
        },
        homeTeam: true,
        awayTeam: true,
      },
    }),
    prisma.leagueMatch.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        season: { include: { league: { include: { country: true } } } },
      },
    }),
  ]);

  const allMatches: NeutralMatch[] = switchGroupMatchesToNeutralMatches(
    matches
  ).concat(
    switchKnockoutMatchesToNeutralMatches(knockoutMatches),
    switchLeagueMatchesToNeutralMatches(leagueMatches)
  );

  return (
    <div className="h-screen py-24 flex gap-2">
      <div className="w-1/3 *:my-2">
        <MatchesCalender />
        {allMatches.length > 0 && (
          <div className="space-y-2">
            {/* popular League and tournament matches separated by leagues and tournaments, and filtered by date */}
            <h3 className="text-muted-foreground text-sm mt-5">
              Popular League's and Tournament's Matches
            </h3>
            <CategorizedMatchesByDate allMatches={allMatches} />
          </div>
        )}
        {allMatches.length > 0 && (
          <div className="space-y-2 pb-24">
            {/* Matches & Leagues by countries */}
            <h3 className="text-muted-foreground text-sm mt-5">
              Matches by countries
            </h3>
            <CategorizedMatchesByCountry allMatches={allMatches} />
          </div>
        )}
      </div>
      <div className="w-2/3 *:my-2">
        <FeaturedMatches />

        {/* <div>Goalers for most important leagues</div> */}
        <div>
          {/* Most important today League table */}
          <Table className="dark:border-primary/10 border">
            <TableCaption
              className={cn(
                "bg-primary/20 text-foreground text-[16px] font-normal dark:border-primary/10 py-4"
              )}
            >
              UEFA Champions League
            </TableCaption>

            <TableHeader>
              <TableRow className="dashboard-head-table-row">
                <TableHead className="dashboard-head-table-cell min-w-[150px] max-2xs:min-w-[100px]">
                  Team
                </TableHead>
                <TableHead className="w-1/12 max-xs:w-1/6 max-sm:w-1/3 text-center">
                  <span className="hidden max-xs:block">P</span>
                  <span className="hidden xs:block">Played</span>
                </TableHead>
                <TableHead className="w-1/12 hidden sm:table-cell">
                  <span>W</span>
                </TableHead>
                <TableHead className="w-1/12 hidden sm:table-cell">
                  <span>L</span>
                </TableHead>
                <TableHead className="w-1/12 hidden sm:table-cell">
                  <span>D</span>
                </TableHead>
                <TableHead className="w-1/12 hidden sm:table-cell">
                  <span>GF</span>
                </TableHead>
                <TableHead className="w-1/12 hidden sm:table-cell">
                  <span>GA</span>
                </TableHead>
                <TableHead className="w-1/12 max-xs:w-1/6 max-sm:w-1/3">
                  <span>+/-</span>
                </TableHead>
                <TableHead className="w-1/12 max-xs:w-1/6 max-sm:w-1/3">
                  <span className="hidden max-xs:block">Pts</span>
                  <span className="hidden xs:block">Points</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((team, idx) => (
                <TableRow key={idx} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell text-left flex gap-3 items-center">
                    <Image
                      width={25}
                      height={25}
                      src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                      alt="team"
                    />
                    <span className="hidden 2xs:block">Team Name</span>
                  </TableCell>
                  <TableCell className="py-4">2</TableCell>
                  <TableCell className="hidden sm:table-cell py-4">2</TableCell>
                  <TableCell className="hidden sm:table-cell py-4">0</TableCell>
                  <TableCell className="hidden sm:table-cell py-4">0</TableCell>
                  <TableCell className="hidden sm:table-cell py-4">5</TableCell>
                  <TableCell className="hidden sm:table-cell py-4">1</TableCell>
                  <TableCell className="py-4">4</TableCell>
                  <TableCell className="py-4">6</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-2 pb-24">
          <div className="flex-1">
            {/* Popular Leagues */}
            <div className="bg-primary/10 *:border-b">
              <h3 className="text-center text-lg py-2">Popular Leagues</h3>
              <div className="flex flex-col items-start justify-center gap-2 *:border-b">
                {Array.from({ length: 10 }).map((a, idx) => (
                  <div
                    key={idx}
                    className="w-full flex gap-4 items-center px-4 py-2"
                  >
                    <Image
                      width={25}
                      height={25}
                      src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                      alt="team"
                    />
                    <p className="font-semibold text-sm">League 1</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            {/* Popular teams */}
            <div className="bg-primary/10 *:border-b">
              <h3 className="text-center text-lg py-2">Popular Teams</h3>
              <div className="flex flex-col items-start justify-center gap-2 *:border-b">
                {Array.from({ length: 10 }).map((a, idx) => (
                  <div
                    key={idx}
                    className="w-full flex gap-4 items-center px-4 py-2"
                  >
                    <Image
                      width={25}
                      height={25}
                      src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                      alt="team"
                    />
                    <p className="font-semibold text-sm">Team 1</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
