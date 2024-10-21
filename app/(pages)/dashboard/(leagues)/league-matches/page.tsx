import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import {
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
  getFormattedDate,
  getFormattedDateTime,
  getFormattedTime,
  getStartAndEndDates,
} from "@/lib/getFormattedDate";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";

import FeaturedSwitcher from "@/components/table-parts/FeaturedSwitcher";
import PopoverMatchScoreUpdator from "@/components/table-parts/PopoverMatchScoreUpdator";
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/filters/Filters";
import PopoverStatusUpdator from "@/components/table-parts/PopoverStatusUpdator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NotProvidedSpan from "@/components/NotProvidedSpan";

export default async function DashboardLeagueMatchesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: String;
    isFeatured?: string;
    status?: string;
    date?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "date";
  const isFeaturedCondition = searchParams?.isFeatured;
  const statusCondition = searchParams?.status || "all";
  const dateCondition = searchParams?.date || undefined;

  let startAndEndDates;
  if (dateCondition) startAndEndDates = getStartAndEndDates(dateCondition);

  const where = {
    OR: [
      { season: { league: { name: { contains: query } } } },
      { season: { year: { contains: query } } },
      { homeTeam: { name: { contains: query } } },
      { awayTeam: { name: { contains: query } } },
      { round: { contains: query } },
    ],
    ...(isFeaturedCondition
      ? {
          isFeatured:
            isFeaturedCondition === FlagFilterOptions.Yes.toLowerCase()
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
    ...(sortField === "league"
      ? { season: { league: { name: sortDir } } }
      : sortField === "season"
      ? { season: { year: sortDir } }
      : sortField === "homeTeam"
      ? { homeTeam: { name: sortDir } }
      : sortField === "awayTeam"
      ? { awayTeam: { name: sortDir } }
      : sortField === "round"
      ? { round: sortDir }
      : sortField === "isFeatured"
      ? { isFeatured: sortDir }
      : sortField === "date"
      ? { date: sortDir }
      : sortField === "status"
      ? { status: sortDir }
      : {}),
  };

  const totalMatchesCount = await prisma.leagueMatch.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalMatchesCount / PAGE_RECORDS_COUNT);

  const leagueMatches = await prisma.leagueMatch.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      homeTeam: true,
      awayTeam: true,
      season: {
        include: {
          league: true,
        },
      },
    },
  });

  const sortingList = [
    { label: "League", fieldName: "league" },
    { label: "Season", fieldName: "season" },
    { label: "Home Team", fieldName: "homeTeam" },
    { label: "Away Team", fieldName: "awayTeam" },
    { label: "Round", fieldName: "round" },
    {
      label: "Is Featured",
      fieldName: "isFeatured",
    },
    { label: "Date", fieldName: "date" },
    { label: "Status", fieldName: "status" },
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
  ];

  const listFilters = [
    {
      title: "status",
      fieldName: "status",
      searchParamName: "status",
      placeholder: "Choose status...",
      options: Object.values(MatchStatusOptions),
    },
  ];

  return (
    <>
      <PageHeader label="Leagues Matches List" />
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
        />
        <SearchFieldComponent placeholder="Search by league names, years, rounds, teams ..." />
        <AddNewLinkComponent
          href="/dashboard/league-matches/new"
          label="Add New Match"
        />
      </div>
      {leagueMatches.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row text-[12px]">
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent
                  fieldName="homeTeam"
                  label="Home Team"
                  labelForSmallerDevices="HT"
                /> */}
                <span className="hidden max-sm:block">HT</span>
                <span className="hidden sm:block">Home Team</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent
                  fieldName="awayTeam"
                  label="Away Team"
                  labelForSmallerDevices="AT"
                /> */}
                <span className="hidden max-sm:block">AT</span>
                <span className="hidden sm:block">Away Team</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Score</TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent
                  fieldName="date"
                  label="Date & Time"
                  labelForSmallerDevices="D&T"
                /> */}
                <span className="hidden max-sm:block">D&T</span>
                <span className="hidden sm:block">Date & Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent
                  fieldName="round"
                  label="Round"
                  labelForSmallerDevices="Rnd"
                /> */}
                <span className="hidden max-sm:block">Rnd</span>
                <span className="hidden sm:block">Round</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent fieldName="league" label="League" /> */}
                <span className="hidden max-sm:block">Leg</span>
                <span className="hidden sm:block">League</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent fieldName="season" label="Season" /> */}
                <span className="hidden max-sm:block">Son</span>
                <span className="hidden sm:block">Season</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent fieldName="isFeatured" label="Is Featured" /> */}
                Is Featured
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                {/* <SortComponent fieldName="status" label="Status" /> */}
                Status
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[11px] sm:text-[12px]">
            {leagueMatches.map(
              ({
                id,
                homeTeam,
                awayTeam,
                homeGoals,
                awayGoals,
                round,
                date,
                season,
                isFeatured,
                status,
              }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">{homeTeam.code}</span>
                    <span className="hidden sm:block">{homeTeam.name}</span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">{awayTeam.code}</span>
                    <span className="hidden sm:block">{awayTeam.name}</span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <PopoverMatchScoreUpdator
                            id={id}
                            type="leagueMatches"
                            homeTeamName={homeTeam.name}
                            awayTeamName={awayTeam.name}
                            tournamentName={season.league.name}
                            editionName={season.year}
                            roundName={round || ""}
                            date={
                              date
                                ? getFormattedDateTime(date.toString())
                                : "No date information"
                            }
                            homeGoals={homeGoals}
                            awayGoals={awayGoals}
                          >
                            <span className="hover:underline">
                              {!homeGoals && !awayGoals ? (
                                <NotProvidedSpan hover={true} />
                              ) : (
                                <>
                                  {homeGoals} - {awayGoals}
                                </>
                              )}
                            </span>
                          </PopoverMatchScoreUpdator>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update score</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <div className="flex flex-col">
                      <span className="hidden max-sm:block">
                        {date ? (
                          getFormattedDate(date.toString(), true)
                        ) : (
                          <NotProvidedSpan>
                            Date: <span className="italic">#NP</span>
                          </NotProvidedSpan>
                        )}
                      </span>
                      <span className="hidden max-sm:block">
                        {date ? (
                          getFormattedTime(date.toString(), true, false)
                        ) : (
                          <NotProvidedSpan>
                            Time: <span className="italic">#NP</span>
                          </NotProvidedSpan>
                        )}
                      </span>
                      <span className="hidden sm:block">
                        {date ? (
                          getFormattedDate(date.toString(), true)
                        ) : (
                          <NotProvidedSpan>
                            Date: <span className="italic">#NP</span>
                          </NotProvidedSpan>
                        )}
                      </span>
                      <span className="hidden sm:block">
                        {date ? (
                          getFormattedTime(date.toString(), false, false)
                        ) : (
                          <NotProvidedSpan>
                            Time: <span className="italic">#NP</span>
                          </NotProvidedSpan>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {round || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {season.league.name}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {season.year}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FeaturedSwitcher
                            id={id}
                            type="leagueMatches"
                            isFeatured={isFeatured}
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
                          <PopoverStatusUpdator
                            id={id}
                            status={status}
                            type="leagueMatches"
                          >
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
                  <ActionsCellDropDown
                    editHref={`/dashboard/league-matches/${id}`}
                  />
                </TableRow>
              )
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalMatchesCount}
            totalPages={totalPages}
            colSpan={10}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No League Matches Found" />
      )}
    </>
  );
}