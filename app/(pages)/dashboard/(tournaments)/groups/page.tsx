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

import GroupForm from "@/components/forms/GroupForm";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardGroupsPage({
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
      { tournamentEdition: { tournament: { name: { contains: query } } } },
      { tournamentEdition: { year: { contains: query } } },
      { name: { contains: query } },
    ],
  };

  const orderBy = {
    ...(sortField === "tournament"
      ? { tournamentEdition: { tournament: { name: sortDir } } }
      : sortField === "edition"
      ? { tournamentEdition: { year: sortDir } }
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
    { label: "Name", fieldName: "name" },
  ];

  return (
    <>
      <PageHeader label="Groups List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="tournament" />
        <SearchFieldComponent placeholder="Search by tournament names, years, group names ..." />
        <FormDialog id={null} />
      </div>
      {groups.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                Tournament
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Edition
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map(({ id, name, tournamentEdition }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">
                  {tournamentEdition.tournament.name}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {tournamentEdition.year.toString()}
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
            colSpan={4}
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
          teams: true,
          tournamentEdition: {
            include: {
              tournament: true,
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
