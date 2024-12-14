import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import {
  SortDirectionOptions,
  Continents,
  FlagFilterOptions,
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

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/Filters";
import NotProvidedSpan from "@/components/NotProvidedSpan";
import FieldSwitcher from "@/components/table-parts/FieldSwitcher";

import LeagueTeamForm from "@/components/forms/LeagueTeamForm";

import { Country } from "@prisma/client";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLeagueTeamsPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
    isPopular?: string | null;
    isClub?: string | null;
    continent?: string | null;
    country?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const isPopularCondition = searchParams?.isPopular;
  const isClubCondition = searchParams?.isClub;
  const continentCondition = searchParams?.continent || "all";
  const countryCondition = searchParams?.country || "all";

  const where = {
    OR: [
      { name: { contains: query } },
      { code: { contains: query } },
      { country: { name: { contains: query } } },
      { continent: { contains: query } },
    ],
    ...(isPopularCondition
      ? {
          isPopular:
            isPopularCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(isClubCondition
      ? {
          isClub:
            isClubCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(continentCondition !== "all"
      ? {
          continent: continentCondition,
        }
      : {}),
    ...(countryCondition !== "all"
      ? {
          country: { name: countryCondition },
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "country"
      ? { country: { name: sortDir } }
      : sortField === "name"
      ? { name: sortDir }
      : sortField === "code"
      ? { code: sortDir }
      : sortField === "continent"
      ? { continent: sortDir }
      : sortField === "isPopular"
      ? { isPopular: sortDir }
      : sortField === "isClub"
      ? { isClub: sortDir }
      : {}),
  };

  const totalTeamsCount = await prisma.team.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalTeamsCount / PAGE_RECORDS_COUNT);

  const teams = await prisma.team.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: { country: true },
  });

  const sortingList = [
    { label: "Country", fieldName: "country" },
    { label: "Continent", fieldName: "continent" },
    { label: "Name", fieldName: "name" },
    { label: "Type", fieldName: "type" },
    { label: "Code", fieldName: "code" },
    {
      label: "Is Popular",
      fieldName: "isPopular",
    },
    {
      label: "Is Club",
      fieldName: "isClub",
    },
  ];

  const listFilters = [
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
  ];

  const flagFilters = [
    {
      title: "Is Popular",
      defaultValue: "all",
      fieldName: "isPopular",
      searchParamName: "isPopular",
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
      title: "Is Club",
      defaultValue: "all",
      fieldName: "isClub",
      searchParamName: "isClub",
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

  // const countries = await prisma.country.findMany();

  return (
    <>
      <PageHeader label="League Teams List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters
          flagFilters={flagFilters}
          listFilters={listFilters}
          textFilters={textFilters}
        />
        <SearchFieldComponent placeholder="Search by team names, codes, countries, continents ..." />
        <FormDialog id={null} />
        {/* <FormDialog countries={countries} id={null} /> */}
      </div>
      {teams.length > 0 ? (
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
              <TableHead className="dashboard-head-table-cell">Code</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Popular
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Club
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map(
              ({ id, name, code, country, continent, isPopular, isClub }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">
                    {continent}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {country?.name || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">{name}</TableCell>
                  <TableCell className="dashboard-table-cell">
                    {code || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FieldSwitcher
                            id={id}
                            type="leagueTeams"
                            value={isPopular}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update popular status</p>
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
                            type="leagueTeams"
                            value={isClub}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update club status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {/* <FormDialog countries={countries} id={id} /> */}
                    <FormDialog id={id} />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalTeamsCount}
            totalPages={totalPages}
            colSpan={8}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No League Teams Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const team = id
    ? await prisma.team.findUnique({
        where: { id },
        include: { country: true },
      })
    : null;

  if (id && !team) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {team == null ? (
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
        <LeagueTeamForm team={team} />
      </DialogContent>
    </Dialog>
  );
}
