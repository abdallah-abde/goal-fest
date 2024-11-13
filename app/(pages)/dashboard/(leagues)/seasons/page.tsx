import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { LeagueStages, SortDirectionOptions } from "@/types/enums";

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

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/Filters";
import PopoverStageUpdator from "@/components/table-parts/PopoverStageUpdator";
import NotProvidedSpan from "@/components/NotProvidedSpan";

import SeasonForm from "@/components/forms/SeasonForm";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { League, LeagueTeam } from "@prisma/client";

export default async function DashboardSeasonsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: string;
    stage?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "year";
  const stageCondition = searchParams?.stage || "all";

  const where = {
    OR: [
      { league: { name: { contains: query } } },
      { league: { country: { name: { contains: query } } } },
      { year: { contains: query } },
      { winner: { name: { contains: query } } },
      { titleHolder: { name: { contains: query } } },
    ],
    ...(stageCondition !== "all"
      ? {
          currentStage: stageCondition,
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "country"
      ? { league: { country: { name: sortDir } } }
      : sortField === "name"
      ? { league: { name: sortDir } }
      : sortField === "year"
      ? { year: sortDir }
      : sortField === "winner"
      ? { winner: { name: sortDir } }
      : sortField === "titleHolder"
      ? { titleHolder: { name: sortDir } }
      : sortField === "currentStage"
      ? { currentStage: sortDir }
      : {}),
  };

  const totalSeasonsCount = await prisma.leagueSeason.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalSeasonsCount / PAGE_RECORDS_COUNT);

  const seasons = await prisma.leagueSeason.findMany({
    where: {
      ...where,
    },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      league: {
        include: {
          country: true,
        },
      },
      winner: true,
      titleHolder: true,
    },
  });

  const sortingList = [
    { label: "Country", fieldName: "country" },
    { label: "Name", fieldName: "name" },
    { label: "Year", fieldName: "year" },
    {
      label: "Winner",
      fieldName: "winner",
    },
    {
      label: "Title Holder",
      fieldName: "titleHolder",
    },
    {
      label: "Current Stage",
      fieldName: "currentStage",
    },
  ];

  const listFilters = [
    {
      title: "Stage",
      fieldName: "stage",
      searchParamName: "stage",
      placeholder: "Choose Stage...",
      options: Object.values(LeagueStages),
    },
  ];

  return (
    <>
      <PageHeader label="Seasons List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters listFilters={listFilters} />
        <SearchFieldComponent placeholder="Search by league names, countries, years, winners, title holders ..." />
        <FormDialog id={null} />
      </div>
      {seasons.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                Country
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Year</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Winner
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Title Holder
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Stage</TableHead>
              <TableHead className="dashboard-head-table-cell">Slug</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.map(
              ({
                id,
                league: { name, country },
                year,
                winner,
                titleHolder,
                currentStage,
                slug,
              }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">
                    {country?.name || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">{name}</TableCell>
                  <TableCell className="dashboard-table-cell">{year}</TableCell>
                  <TableCell className="dashboard-table-cell">
                    {winner?.name || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {titleHolder?.name || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <PopoverStageUpdator
                            id={id}
                            stage={currentStage}
                            type="leagues"
                          >
                            <span className="hover:underline">
                              {currentStage || <NotProvidedSpan hover={true} />}
                            </span>
                          </PopoverStageUpdator>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update stage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">{slug}</TableCell>
                  <TableCell>
                    <FormDialog id={id} />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalSeasonsCount}
            totalPages={totalPages}
            colSpan={8}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Seasons Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const leagueSeason = id
    ? await prisma.leagueSeason.findUnique({
        where: { id },
        include: {
          league: { include: { country: true } },
          teams: true,
        },
      })
    : null;

  if (id && !leagueSeason) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {leagueSeason == null ? (
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
        <SeasonForm leagueSeason={leagueSeason} />
      </DialogContent>
    </Dialog>
  );
}
