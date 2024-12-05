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
    type?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const isPopularCondition = searchParams?.isPopular;
  const typeCondition = searchParams?.type || "all";

  const where = {
    OR: [
      { country: { name: { contains: query } } },
      { name: { contains: query } },
      { code: { contains: query } },
    ],
    ...(isPopularCondition
      ? {
          isPopular:
            isPopularCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(typeCondition !== "all"
      ? {
          type: typeCondition,
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
      : sortField === "type"
      ? { type: sortDir }
      : sortField === "isPopular"
      ? { isPopular: sortDir }
      : {}),
  };

  const totalLeagueTeamsCount = await prisma.leagueTeam.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalLeagueTeamsCount / PAGE_RECORDS_COUNT);

  const LeagueTeams = await prisma.leagueTeam.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: { country: true },
  });

  const sortingList = [
    { label: "Country", fieldName: "country" },
    { label: "Name", fieldName: "name" },
    { label: "Type", fieldName: "type" },
    { label: "Code", fieldName: "code" },
    {
      label: "Is Popular",
      fieldName: "isPopular",
    },
  ];

  const listFilters = [
    {
      title: "Type",
      fieldName: "type",
      searchParamName: "type",
      placeholder: "Choose Type...",
      options: Object.values(Continents),
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
  ];

  const countries = await prisma.country.findMany();

  return (
    <>
      <PageHeader label="League Teams List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters flagFilters={flagFilters} listFilters={listFilters} />
        <SearchFieldComponent placeholder="Search by team names, codes ..." />
        <FormDialog countries={countries} id={null} />
      </div>
      {LeagueTeams.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                Country
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Code</TableHead>
              <TableHead className="dashboard-head-table-cell">Type</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Popular
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LeagueTeams.map(({ id, name, code, country, type, isPopular }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">
                  {country?.name || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {code || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {type || <NotProvidedSpan />}
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
                <TableCell>
                  <FormDialog countries={countries} id={id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalLeagueTeamsCount}
            totalPages={totalPages}
            colSpan={6}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No League Teams Found" />
      )}
    </>
  );
}

async function FormDialog({
  countries,
  id,
}: {
  countries: Country[];
  id: number | null;
}) {
  const leagueTeam = id
    ? await prisma.leagueTeam.findUnique({
        where: { id },
      })
    : null;

  if (id && !leagueTeam) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {leagueTeam == null ? (
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
        <LeagueTeamForm countries={countries} leagueTeam={leagueTeam} />
      </DialogContent>
    </Dialog>
  );
}
