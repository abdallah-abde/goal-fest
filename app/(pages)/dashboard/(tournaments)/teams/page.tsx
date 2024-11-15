import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionOptions, Continents } from "@/types/enums";

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
import Filters from "@/components/table-parts/Filters";
import NotProvidedSpan from "@/components/NotProvidedSpan";

import TeamForm from "@/components/forms/TeamForm";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardTeamsPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
    type?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const typeCondition = searchParams?.type || "all";

  const where = {
    OR: [{ name: { contains: query } }, { code: { contains: query } }],
    ...(typeCondition !== "all"
      ? {
          type: typeCondition,
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "code"
      ? { code: sortDir }
      : sortField === "type"
      ? { type: sortDir }
      : {}),
  };

  const totalTeamsCount = await prisma.team.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalTeamsCount / PAGE_RECORDS_COUNT);

  const teams = await prisma.team.findMany({
    where: {
      ...where,
    },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
  });

  const sortingList = [
    { label: "Name", fieldName: "name" },
    { label: "Code", fieldName: "code" },
    { label: "Type", fieldName: "type" },
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

  return (
    <>
      <PageHeader label="Teams List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters listFilters={listFilters} />
        <SearchFieldComponent placeholder="Search by team names, codes ..." />
        <FormDialog id={null} />
      </div>
      {teams.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Code</TableHead>
              <TableHead className="dashboard-head-table-cell">Type</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map(({ id, name, code, type }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {code || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {type || <NotProvidedSpan />}
                </TableCell>
                <TableCell>
                  <FormDialog id={id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalTeamsCount}
            totalPages={totalPages}
            colSpan={4}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Teams Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const team = id
    ? await prisma.team.findUnique({
        where: { id },
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
        <TeamForm team={team} />
      </DialogContent>
    </Dialog>
  );
}
