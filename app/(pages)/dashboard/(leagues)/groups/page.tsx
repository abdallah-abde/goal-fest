import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { Continents, SortDirectionOptions } from "@/types/enums";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import SortByList from "@/components/table-parts/SortByList";
import NotProvidedSpan from "@/components/NotProvidedSpan";

import GroupForm from "@/components/forms/GroupForm";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Filters from "@/components/table-parts/Filters";

export default async function DashboardLeagueGroupsPage({
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
    season?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const continentCondition = searchParams?.continent || "all";
  const countryCondition = searchParams?.country || "all";
  const leagueCondition = searchParams?.league || "all";
  const seasonCondition = searchParams?.season || "all";

  const where = {
    OR: [
      { name: { contains: query } },
      { season: { league: { country: { name: { contains: query } } } } },
      { season: { league: { name: { contains: query } } } },
      { season: { year: { contains: query } } },
      { season: { league: { continent: { contains: query } } } },
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
  };

  const orderBy = {
    ...(sortField === "continent"
      ? { season: { league: { continent: sortDir } } }
      : sortField === "country"
      ? { season: { league: { country: { name: sortDir } } } }
      : sortField === "league"
      ? { season: { league: { name: sortDir } } }
      : sortField === "season"
      ? { season: { year: sortDir } }
      : sortField === "name"
      ? { name: sortDir }
      : {}),
  };

  const totalGroupsCount = await prisma.group.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalGroupsCount / PAGE_RECORDS_COUNT);

  const groups = await prisma.group.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      teams: true,
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
    { label: "Name", fieldName: "name" },
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
  ];

  return (
    <>
      <PageHeader label="Groups List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="league" />
        <Filters listFilters={listFilters} textFilters={textFilters} />
        <SearchFieldComponent placeholder="Search by league names, years, countries, continents, group names ..." />
        <FormDialog id={null} />
      </div>
      {groups.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                Continent
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Country
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                League
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Season
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map(({ id, name, season }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">
                  {season.league.continent}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {season.league.country?.name || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {season.league.name}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {season.year}
                </TableCell>
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell>
                  <FormDialog id={id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalGroupsCount}
            totalPages={totalPages}
            colSpan={6}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Groups Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const group = id
    ? await prisma.group.findUnique({
        where: { id },
        include: {
          teams: {
            include: {
              country: true,
            },
          },
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
      })
    : null;

  if (id && !group) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {group == null ? (
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
        <GroupForm group={group} />
      </DialogContent>
    </Dialog>
  );
}
