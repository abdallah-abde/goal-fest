import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionOptions } from "@/types/enums";

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

import LeagueGroupForm from "@/components/forms/LeagueGroupForm";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLeagueGroupsPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";

  const where = {
    OR: [
      { season: { league: { country: { name: { contains: query } } } } },
      { season: { league: { name: { contains: query } } } },
      { season: { year: { contains: query } } },
      { name: { contains: query } },
    ],
  };

  const orderBy = {
    ...(sortField === "country"
      ? { season: { league: { country: { name: sortDir } } } }
      : sortField === "league"
      ? { season: { league: { name: sortDir } } }
      : sortField === "season"
      ? { season: { year: sortDir } }
      : sortField === "name"
      ? { name: sortDir }
      : {}),
  };

  const totalGroupsCount = await prisma.leagueGroup.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalGroupsCount / PAGE_RECORDS_COUNT);

  const groups = await prisma.leagueGroup.findMany({
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
    { label: "Country", fieldName: "country" },
    { label: "League", fieldName: "league" },
    { label: "Season", fieldName: "season" },
    { label: "Name", fieldName: "name" },
  ];

  const leagues = await prisma.league.findMany();

  return (
    <>
      <PageHeader label="Leagues Groups List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="league" />
        <SearchFieldComponent placeholder="Search by league names, years, countries, group names ..." />
        <FormDialog id={null} />
      </div>
      {groups.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
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
            colSpan={5}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Groups Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const leagueGroup = id
    ? await prisma.leagueGroup.findUnique({
        where: { id },
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
      })
    : null;

  if (id && !leagueGroup) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {leagueGroup == null ? (
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
        <LeagueGroupForm group={leagueGroup} />
      </DialogContent>
    </Dialog>
  );
}
