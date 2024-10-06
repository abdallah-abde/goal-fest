import prisma from "@/lib/db";

import Image from "next/image";

import { NeutralMatch } from "@/types";

import MatchesCalender from "@/components/home/MatchesCalender";
import CategorizedMatchesByDate from "@/components/home/CategorizedMatchesByDate";
import CategorizedMatchesByCountry from "@/components/home/CategorizedMatchesByCountry";
import FeaturedMatches from "@/components/home/FeaturedMatches";
import Standings from "@/components/home/Standings";

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
  const values = new Array(
    {
      labels: [{ name: "Team" }],
      className:
        "dashboard-head-table-cell min-w-[150px] max-2xs:min-w-[100px]",
    },
    {
      labels: [
        { name: "P", className: "hidden max-xs:block" },
        { name: "Played", className: "hidden xs:block" },
      ],
      className: "w-1/12 max-xs:w-1/6 max-sm:w-1/3 text-center",
    },
    {
      labels: [{ name: "W" }],
      className: "w-1/12 hidden sm:table-cell",
    },
    {
      labels: [{ name: "L" }],
      className: "w-1/12 hidden sm:table-cell",
    },
    {
      labels: [{ name: "D" }],
      className: "w-1/12 hidden sm:table-cell",
    },
    {
      labels: [{ name: "GF" }],
      className: "w-1/12 hidden sm:table-cell",
    },
    {
      labels: [{ name: "GA" }],
      className: "w-1/12 hidden sm:table-cell",
    },
    {
      labels: [{ name: "+/-" }],
      className: "w-1/12 max-xs:w-1/6 max-sm:w-1/3",
    },
    {
      labels: [
        { name: "Pts", className: "hidden max-xs:block" },
        { name: "Points", className: "hidden xs:block" },
      ],
      className: "w-1/12 max-xs:w-1/6 max-sm:w-1/3",
    }
  );

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

        <Standings values={values} date={[startDate, endDate]} />

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
