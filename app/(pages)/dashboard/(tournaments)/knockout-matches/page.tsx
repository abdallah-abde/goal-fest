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
import PopoverKnockoutMatchScoreUpdator from "@/components/table-parts/PopoverKnockoutMatchScoreUpdator";
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/filters/Filters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PopoverStatusUpdator from "@/components/table-parts/PopoverStatusUpdator";
import NotProvidedSpan from "@/components/NotProvidedSpan";
import DateTimeTableCell from "@/components/table-parts/DateTimeTableCell";

export default async function DashboardKnockoutMatchesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: string;
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
      { tournamentEdition: { tournament: { name: { contains: query } } } },
      { tournamentEdition: { year: { contains: query } } },
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
    ...(sortField === "tournament"
      ? { tournamentEdition: { tournament: { name: sortDir } } }
      : sortField === "edition"
      ? { tournamentEdition: { year: sortDir } }
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
      : {}),
  };

  const totalMatchesCount = await prisma.knockoutMatch.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalMatchesCount / PAGE_RECORDS_COUNT);

  const matches = await prisma.knockoutMatch.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      homeTeam: true,
      awayTeam: true,
      tournamentEdition: {
        include: {
          tournament: true,
        },
      },
    },
  });

  const sortingList = [
    { label: "Tournament", fieldName: "tournament" },
    { label: "Edition", fieldName: "edition" },
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
      <PageHeader label="Knockout Matches List" />
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
        <SearchFieldComponent placeholder="Search by tournamet names, years, group names, rounds, teams ..." />
        <AddNewLinkComponent
          href="/dashboard/knockout-matches/new"
          label="Add New Match"
        />
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
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">MT</span>
                <span className="hidden sm:block">Main Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">ET</span>
                <span className="hidden sm:block">Extra Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Pen</span>
                <span className="hidden sm:block">Penalties</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">D&T</span>
                <span className="hidden sm:block">Date & Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Rnd</span>
                <span className="hidden sm:block">Round</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Tour</span>
                <span className="hidden sm:block">Tournament</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Edi</span>
                <span className="hidden sm:block">Edition</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Featured
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
                homeExtraTimeGoals,
                awayExtraTimeGoals,
                homeTeamPlacehlder,
                awayTeamPlacehlder,
                homePenaltyGoals,
                awayPenaltyGoals,
                date,
                round,
                tournamentEdition,
                isFeatured,
                status,
              }) => {
                const homeTeamName = homeTeam
                  ? homeTeam.name
                  : homeTeamPlacehlder;
                const homeTeamCode = homeTeam
                  ? homeTeam.code
                  : homeTeamPlacehlder;
                const awayTeamName = awayTeam
                  ? awayTeam.name
                  : awayTeamPlacehlder;
                const awayTeamCode = awayTeam
                  ? awayTeam.code
                  : awayTeamPlacehlder;
                const tournamentName = tournamentEdition.tournament.name;
                const editionName = tournamentEdition.year;
                const roundName = round;
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
                        homeTeamName={homeTeamName || ""}
                        awayTeamName={awayTeamName || ""}
                        tournamentName={tournamentName}
                        editionName={editionName}
                        roundName={roundName || ""}
                        date={matchDate}
                        homeGoals={homeGoals}
                        awayGoals={awayGoals}
                        homeExtraTimeGoals={homeExtraTimeGoals}
                        awayExtraTimeGoals={awayExtraTimeGoals}
                        homePenaltyGoals={homePenaltyGoals}
                        awayPenaltyGoals={awayPenaltyGoals}
                        type="MT"
                      />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <ScoreTableCell
                        id={id}
                        homeTeamName={homeTeamName || ""}
                        awayTeamName={awayTeamName || ""}
                        tournamentName={tournamentName}
                        editionName={editionName}
                        roundName={roundName || ""}
                        date={matchDate}
                        homeGoals={homeGoals}
                        awayGoals={awayGoals}
                        homeExtraTimeGoals={homeExtraTimeGoals}
                        awayExtraTimeGoals={awayExtraTimeGoals}
                        homePenaltyGoals={homePenaltyGoals}
                        awayPenaltyGoals={awayPenaltyGoals}
                        type="ET"
                      />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <ScoreTableCell
                        id={id}
                        homeTeamName={homeTeamName || ""}
                        awayTeamName={awayTeamName || ""}
                        tournamentName={tournamentName}
                        editionName={editionName}
                        roundName={roundName || ""}
                        date={matchDate}
                        homeGoals={homeGoals}
                        awayGoals={awayGoals}
                        homeExtraTimeGoals={homeExtraTimeGoals}
                        awayExtraTimeGoals={awayExtraTimeGoals}
                        homePenaltyGoals={homePenaltyGoals}
                        awayPenaltyGoals={awayPenaltyGoals}
                        type="PT"
                      />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <DateTimeTableCell date={date} />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {round || <NotProvidedSpan />}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {tournamentEdition.tournament.name}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {tournamentEdition.year}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FeaturedSwitcher
                              id={id}
                              type="knockoutMatches"
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
                              type="knockoutMatches"
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
                      editHref={`/dashboard/knockout-matches/${id}`}
                    />
                  </TableRow>
                );
              }
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalMatchesCount}
            totalPages={totalPages}
            colSpan={12}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Knockout Matches Found" />
      )}
    </>
  );
}

function ScoreTableCell({
  id,
  homeTeamName,
  awayTeamName,
  tournamentName,
  editionName,
  roundName,
  date,
  homeGoals,
  awayGoals,
  homeExtraTimeGoals,
  awayExtraTimeGoals,
  homePenaltyGoals,
  awayPenaltyGoals,
  type,
}: {
  id: number;
  homeTeamName: string;
  awayTeamName: string;
  tournamentName: string;
  editionName: string;
  roundName: string;
  date: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeExtraTimeGoals?: number | null;
  awayExtraTimeGoals?: number | null;
  homePenaltyGoals?: number | null;
  awayPenaltyGoals?: number | null;
  type: "MT" | "ET" | "PT";
}) {
  const condition =
    type === "MT"
      ? homeGoals === null && awayGoals === null
      : type === "ET"
      ? homeExtraTimeGoals === null && awayExtraTimeGoals === null
      : homePenaltyGoals === null && awayPenaltyGoals === null;

  const score =
    type === "MT"
      ? `${homeGoals} - ${awayGoals}`
      : type === "ET"
      ? `${homeExtraTimeGoals} - ${awayExtraTimeGoals}`
      : `${homePenaltyGoals} - ${awayPenaltyGoals}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <PopoverKnockoutMatchScoreUpdator
            id={id}
            homeTeamName={homeTeamName || ""}
            awayTeamName={awayTeamName || ""}
            tournamentName={tournamentName}
            editionName={editionName}
            roundName={roundName || ""}
            date={date}
            homeGoals={homeGoals}
            awayGoals={awayGoals}
            homeExtraTimeGoals={homeExtraTimeGoals}
            awayExtraTimeGoals={awayExtraTimeGoals}
            homePenaltyGoals={homePenaltyGoals}
            awayPenaltyGoals={awayPenaltyGoals}
          >
            <span className="hover:underline">
              {condition ? (
                <NotProvidedSpan hover={true}>#NP</NotProvidedSpan>
              ) : (
                <>{score}</>
              )}
            </span>
          </PopoverKnockoutMatchScoreUpdator>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to update score</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
