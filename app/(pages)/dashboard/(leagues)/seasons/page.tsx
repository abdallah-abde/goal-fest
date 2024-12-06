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

export default async function DashboardSeasonsPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
    continent?: string | null;
    country?: string | null;
    league?: string | null;
    stage?: string | null;
    winner?: string | null;
    titleHolder?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "year";
  const stageCondition = searchParams?.stage || "all";
  const continentCondition = searchParams?.continent || "all";
  const countryCondition = searchParams?.country || "all";
  const leagueCondition = searchParams?.league || "all";
  const winnerCondition = searchParams?.winner || "all";
  const titleHolderCondition = searchParams?.titleHolder || "all";

  const where = {
    OR: [
      { league: { name: { contains: query } } },
      { league: { country: { name: { contains: query } } } },
      { league: { continent: { contains: query } } },
      { year: { contains: query } },
      {
        hostingCountries: {
          some: {
            name: {
              contains: query,
            },
          },
        },
      },
      { currentStage: { contains: query } },
      { winner: { name: { contains: query } } },
      { titleHolder: { name: { contains: query } } },
    ],
    ...(stageCondition !== "all"
      ? {
          currentStage: stageCondition,
        }
      : {}),
    ...(leagueCondition !== "all"
      ? {
          league: { name: leagueCondition },
        }
      : {}),
    ...(continentCondition !== "all"
      ? {
          league: { continent: continentCondition },
        }
      : {}),
    ...(countryCondition !== "all"
      ? {
          OR: [
            {
              league: { country: { name: countryCondition } },
            },
            {
              hostingCountries: {
                some: {
                  name: countryCondition,
                },
              },
            },
          ],
        }
      : {}),
    ...(winnerCondition !== "all"
      ? {
          winner: { name: winnerCondition },
        }
      : {}),
    ...(titleHolderCondition !== "all"
      ? {
          titleHolder: { name: titleHolderCondition },
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "country"
      ? { league: { country: { name: sortDir } } }
      : sortField === "continent"
      ? { league: { continent: sortDir } }
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

  const totalSeasonsCount = await prisma.season.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalSeasonsCount / PAGE_RECORDS_COUNT);

  const seasons = await prisma.season.findMany({
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
      teams: true,
      hostingCountries: true,
    },
  });

  const sortingList = [
    { label: "Country", fieldName: "country" },
    { label: "Continent", fieldName: "continent" },
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

  const textFilters = [
    {
      title: "Country",
      fieldName: "country",
      searchParamName: "country",
    },
    {
      title: "Continent",
      fieldName: "continent",
      searchParamName: "continent",
    },
    {
      title: "Winner",
      fieldName: "winner",
      searchParamName: "winner",
    },
    {
      title: "Title Holder",
      fieldName: "titleHolder",
      searchParamName: "titleHolder",
    },
  ];

  return (
    <>
      <PageHeader label="Seasons List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters listFilters={listFilters} textFilters={textFilters} />
        <SearchFieldComponent placeholder="Search by league names, countries, continents, years, winners, title holders, stages ..." />
        <FormDialog id={null} />
      </div>
      {seasons.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                Continent
              </TableHead>
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
                league: { name, country, continent },
                year,
                winner,
                titleHolder,
                currentStage,
                slug,
              }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">
                    {continent}
                  </TableCell>
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
            colSpan={9}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Seasons Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const season = id
    ? await prisma.season.findUnique({
        where: { id },
        include: {
          league: { include: { country: true } },
          teams: true,
          hostingCountries: true,
          winner: true,
          titleHolder: true,
        },
      })
    : null;

  if (id && !season) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {season == null ? (
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
        <SeasonForm season={season} />
      </DialogContent>
    </Dialog>
  );
}
