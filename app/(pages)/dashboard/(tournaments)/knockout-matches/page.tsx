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
import KnockoutScoreTableCell from "@/components/table-parts/KnockoutScoreTableCell";

import KnockoutMatchForm from "@/components/forms/KnockoutMatchForm";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardKnockoutMatchesPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions;
    sortField?: string | null;
    isFeatured?: string | null;
    status?: string | null;
    date?: string | null;
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
        <SearchFieldComponent placeholder="Search by tournamet names, years, rounds, teams ..." />
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

                    {["MT", "ET", "PT"].map((tc) => {
                      const scoreTime =
                        tc === "MT" ? "MT" : tc === "ET" ? "ET" : "PT";

                      return (
                        <TableCell className="dashboard-table-cell">
                          <KnockoutScoreTableCell
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
                            scoreTime={scoreTime}
                            type="knockoutMatches"
                          />
                        </TableCell>
                      );
                    })}

                    <TableCell className="dashboard-table-cell">
                      <DateTimeTableCell date={date} />
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {roundName || <NotProvidedSpan />}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {tournamentName}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      {editionName}
                    </TableCell>
                    <TableCell className="dashboard-table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <FieldSwitcher
                              id={id}
                              type="knockoutMatches"
                              value={isFeatured}
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
            colSpan={12}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Knockout Matches Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const knockoutMatch = id
    ? await prisma.knockoutMatch.findUnique({
        where: { id },
        include: {
          homeTeam: true,
          awayTeam: true,
          tournamentEdition: {
            include: { tournament: true },
          },
        },
      })
    : null;

  if (id && !knockoutMatch) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {knockoutMatch == null ? (
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
        <KnockoutMatchForm match={knockoutMatch} />
      </DialogContent>
    </Dialog>
  );
}
