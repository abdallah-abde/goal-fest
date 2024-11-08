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

import LeagueTeamForm from "@/components/forms/LeagueTeamForm";

import { Country } from "@prisma/client";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLeagueTeamsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: String;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";

  const where = {
    OR: [
      { country: { name: { contains: query } } },
      { name: { contains: query } },
      { code: { contains: query } },
    ],
  };

  const orderBy = {
    ...(sortField === "country"
      ? { country: { name: sortDir } }
      : sortField === "name"
      ? { name: sortDir }
      : sortField === "code"
      ? { code: sortDir }
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
    { label: "Code", fieldName: "code" },
  ];

  const countries = await prisma.country.findMany();

  return (
    <>
      <PageHeader label="League Teams List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
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
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LeagueTeams.map(({ id, name, code, country }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">
                  {country?.name || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {code || <NotProvidedSpan />}
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
            colSpan={4}
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
            <Pencil />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full md:w-3/4 lg:w-2/3 h-3/4">
        <LeagueTeamForm countries={countries} leagueTeam={leagueTeam} />
      </DialogContent>
    </Dialog>
  );
}
