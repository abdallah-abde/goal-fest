import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import {
  Continents,
  FlagFilterOptions,
  MatchStatusOptions,
  SortDirectionOptions,
} from "@/types/enums";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  getFormattedDateTime,
  getStartAndEndDates,
} from "@/lib/getFormattedDate";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import SortByList from "@/components/table-parts/SortByList";
import FieldSwitcher from "@/components/table-parts/FieldSwitcher";
import Filters from "@/components/table-parts/Filters";
import PopoverStatusUpdator from "@/components/table-parts/PopoverStatusUpdator";

import NotProvidedSpan from "@/components/NotProvidedSpan";
import DateTimeTableCell from "@/components/table-parts/DateTimeTableCell";
import ScoreTableCell from "@/components/table-parts/ScoreTableCell";

import MatchForm from "@/components/forms/MatchForm";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLeagueMatchesPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
    isFeatured?: string | null;
    isKnockout?: string | null;
    status?: string | null;
    date?: string | null;
    continent?: string | null;
    country?: string | null;
    league?: string | null;
    season?: string | null;
    group?: string | null;
    round?: string | null;
    team?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "date";
  const isFeaturedCondition = searchParams?.isFeatured;
  const isKnockoutCondition = searchParams?.isKnockout;
  const statusCondition = searchParams?.status || "all";
  const dateCondition = searchParams?.date || undefined;
  const continentCondition = searchParams?.continent || "all";
  const countryCondition = searchParams?.country || "all";
  const leagueCondition = searchParams?.league || "all";
  const seasonCondition = searchParams?.season || "all";
  const groupCondition = searchParams?.group || "all";
  const roundCondition = searchParams?.round || "all";
  const teamCondition = searchParams?.team || "all";

  let startAndEndDates;
  if (dateCondition) startAndEndDates = getStartAndEndDates(dateCondition);

  const where = {
    OR: [
      { season: { league: { country: { name: { contains: query } } } } },
      { season: { league: { continent: { contains: query } } } },
      { season: { league: { name: { contains: query } } } },
      { season: { year: { contains: query } } },
      { homeTeam: { name: { contains: query } } },
      { awayTeam: { name: { contains: query } } },
      { group: { name: { contains: query } } },
      { round: { contains: query } },
      {
        season: {
          hostingCountries: {
            some: {
              name: {
                contains: query,
              },
            },
          },
        },
      },
    ],
    ...(teamCondition !== "all"
      ? {
          OR: [
            {
              homeTeam: { name: teamCondition },
            },
            {
              awayTeam: { name: teamCondition },
            },
          ],
        }
      : {}),
    ...(groupCondition !== "all"
      ? {
          group: { name: groupCondition },
        }
      : {}),
    ...(roundCondition !== "all"
      ? {
          round: roundCondition,
        }
      : {}),
    ...(leagueCondition !== "all"
      ? {
          season: { league: { name: leagueCondition } },
        }
      : {}),
    ...(seasonCondition !== "all"
      ? {
          season: { year: seasonCondition },
        }
      : {}),
    ...(continentCondition !== "all"
      ? {
          season: { league: { continent: continentCondition } },
        }
      : {}),
    ...(countryCondition !== "all"
      ? {
          OR: [
            {
              season: { league: { country: { name: countryCondition } } },
            },
            {
              season: {
                hostingCountries: {
                  some: {
                    name: countryCondition,
                  },
                },
              },
            },
          ],
        }
      : {}),
    ...(isFeaturedCondition
      ? {
          isFeatured:
            isFeaturedCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(isKnockoutCondition
      ? {
          isKnockout:
            isKnockoutCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(statusCondition !== "all"
      ? {
          status: statusCondition,
        }
      : {}),
    ...(dateCondition
      ? {
          date: {
            gte: startAndEndDates?.startDate,
            lte: startAndEndDates?.endDate,
          },
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "country"
      ? { season: { league: { country: { name: sortDir } } } }
      : sortField === "continent"
      ? { season: { league: { continent: sortDir } } }
      : sortField === "league"
      ? { season: { league: { name: sortDir } } }
      : sortField === "season"
      ? { season: { year: sortDir } }
      : sortField === "homeTeam"
      ? { homeTeam: { name: sortDir } }
      : sortField === "awayTeam"
      ? { awayTeam: { name: sortDir } }
      : sortField === "group"
      ? { group: { name: sortDir } }
      : sortField === "round"
      ? { round: sortDir }
      : sortField === "isFeatured"
      ? { isFeatured: sortDir }
      : sortField === "isKnockout"
      ? { isKnockout: sortDir }
      : sortField === "date"
      ? { date: sortDir }
      : sortField === "status"
      ? { status: sortDir }
      : {}),
  };

  const totalMatchesCount = await prisma.match.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalMatchesCount / PAGE_RECORDS_COUNT);

  const matches = await prisma.match.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
      season: {
        include: {
          league: {
            include: {
              country: true,
            },
          },
        },
      },
    },
  });

  const sortingList = [
    { label: "Continent", fieldName: "continent" },
    { label: "Country", fieldName: "country" },
    { label: "League", fieldName: "league" },
    { label: "Season", fieldName: "season" },
    { label: "Group", fieldName: "group" },
    { label: "Round", fieldName: "round" },
    { label: "Home Team", fieldName: "homeTeam" },
    { label: "Away Team", fieldName: "awayTeam" },
    { label: "Date", fieldName: "date" },
    { label: "Status", fieldName: "status" },
    {
      label: "Is Featured",
      fieldName: "isFeatured",
    },
    {
      label: "Is Knockout",
      fieldName: "isKnockout",
    },
  ];

  const flagFilters = [
    {
      title: "Is Featured",
      defaultValue: "all",
      fieldName: "isFeatured",
      searchParamName: "isFeatured",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
    },
    {
      title: "Is Knockout",
      defaultValue: "all",
      fieldName: "isKnockout",
      searchParamName: "isKnockout",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
    },
  ];

  const listFilters = [
    {
      title: "status",
      fieldName: "status",
      searchParamName: "status",
      placeholder: "Choose status...",
      options: Object.values(MatchStatusOptions),
    },
    {
      title: "Continent",
      fieldName: "continent",
      searchParamName: "continent",
      placeholder: "Choose Continent...",
      options: Object.values(Continents),
    },
  ];

  const textFilters = [
    {
      title: "Country",
      fieldName: "country",
      searchParamName: "country",
    },
    {
      title: "League",
      fieldName: "league",
      searchParamName: "league",
    },
    {
      title: "Season",
      fieldName: "season",
      searchParamName: "season",
    },
    {
      title: "Group",
      fieldName: "group",
      searchParamName: "group",
    },
    {
      title: "Round",
      fieldName: "round",
      searchParamName: "round",
    },
    {
      title: "Team",
      fieldName: "team",
      searchParamName: "team",
    },
  ];

  return (
    <>
      <PageHeader label="Matches List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="date" />
        <Filters
          flagFilters={flagFilters}
          listFilters={listFilters}
          filterByDate={{
            title: "Date",
            fieldName: "date",
            searchParamName: "date",
          }}
          textFilters={textFilters}
        />
        <SearchFieldComponent placeholder="Search by league names, years, continents, countries, groups, rounds, teams ..." />
        <FormDialog id={null} />
      </div>
      {matches.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row text-[12px]">
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">HT</span>
                <span className="hidden sm:block">Home Team</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">AT</span>
                <span className="hidden sm:block">Away Team</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Score</TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">D&T</span>
                <span className="hidden sm:block">Date & Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Grp</span>
                <span className="hidden sm:block">Group</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Rnd</span>
                <span className="hidden sm:block">Round</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Con</span>
                <span className="hidden sm:block">Continent</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Cou</span>
                <span className="hidden sm:block">Country</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Leg</span>
                <span className="hidden sm:block">League</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Szn</span>
                <span className="hidden sm:block">Season</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Featured
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Knockout
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Status
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[11px] sm:text-[12px]">
            {matches.map(
              ({
                id,
                homeTeam,
                awayTeam,
                homeGoals,
                awayGoals,
                group,
                round,
                date,
                season,
                isFeatured,
                status,
                isKnockout,
                awayTeamPlacehlder,
                homeTeamPlacehlder,
                awayExtraTimeGoals,
                homeExtraTimeGoals,
                awayPenaltyGoals,
                homePenaltyGoals,
              }) => {
                const homeTeamName = !isKnockout
                  ? homeTeam?.name || ""
                  : homeTeam?.name || homeTeamPlacehlder || "";
                const homeTeamCode = homeTeam?.code || "";
                const awayTeamName = !isKnockout
                  ? awayTeam?.name || ""
                  : awayTeam?.name || awayTeamPlacehlder || "";
                const awayTeamCode = awayTeam?.code || "";
                const leagueName = season.league.name;
                const seasonName = season.year;
                const continent = season.league.continent;
                const countryName = season.league.country?.name;
                const roundName = round;
                const groupName = group?.name;
                const matchDate = date
                  ? getFormattedDateTime(date.toString())
                  : "No date information";

                return (
                  <TableRow key={id} className="dashboard-table-row">
                    <TableCell className="dashboard-table-cell">
                      <span className="hidden max-sm:block">
                        {homeTeamCode}
                      </span>
                      <span className="hidden sm:block">{homeTeamName}</span>
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <span className="hidden max-sm:block">
                        {awayTeamCode}
                      </span>
                      <span className="hidden sm:block">{awayTeamName}</span>
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <ScoreTableCell
                        id={id}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                        leagueName={leagueName}
                        seasonName={seasonName}
                        roundName={roundName || ""}
                        groupName={groupName || ""}
                        date={matchDate}
                        homeGoals={homeGoals}
                        awayGoals={awayGoals}
                        homeExtraTimeGoals={homeExtraTimeGoals}
                        awayExtraTimeGoals={awayExtraTimeGoals}
                        homePenaltyGoals={homePenaltyGoals}
                        awayPenaltyGoals={awayPenaltyGoals}
                        isKnockout={isKnockout}
                      />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <DateTimeTableCell date={date} />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {groupName || <NotProvidedSpan />}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {roundName || <NotProvidedSpan />}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {continent}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {countryName || <NotProvidedSpan />}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {leagueName}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {seasonName}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FieldSwitcher
                              id={id}
                              type="matches"
                              value={isFeatured}
                              field="isFeatured"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to update featured status</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FieldSwitcher
                              id={id}
                              type="matches"
                              value={isKnockout}
                              field="isKnockout"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to update knockout status</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <PopoverStatusUpdator id={id} status={status}>
                              <span className="hover:underline">
                                {status || <NotProvidedSpan hover={true} />}
                              </span>
                            </PopoverStatusUpdator>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to update status</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <FormDialog id={id} />
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalMatchesCount}
            totalPages={totalPages}
            colSpan={14}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Matches Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const match = id
    ? await prisma.match.findUnique({
        where: { id },
        include: {
          homeTeam: { include: { country: true } },
          awayTeam: { include: { country: true } },
          group: true,
          season: {
            include: { groups: true, league: { include: { country: true } } },
          },
        },
      })
    : null;

  if (id && !match) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {match == null ? (
          <Button variant="outline" size="icon">
            <Plus className="size-5" />
          </Button>
        ) : (
          <Button variant="outline" size="icon">
            <Pencil className="size-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full md:w-3/4 lg:w-2/3 h-3/4">
        <MatchForm match={match} />
      </DialogContent>
    </Dialog>
  );
}
