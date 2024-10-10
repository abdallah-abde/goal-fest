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

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import SortComponent from "@/components/table-parts/SortComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";

export default async function DashboardGroupsPage({
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
      { tournamentEdition: { tournament: { name: { contains: query } } } },
      { tournamentEdition: { yearAsString: { contains: query } } },
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

  return (
    <>
      <PageHeader label="Groups List" />
      <div className="dashboard-search-and-add">
        <SearchFieldComponent />
        <AddNewLinkComponent
          href="/dashboard/groups/new"
          label="Add New Group"
        />
      </div>
      {groups.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="tournament" label="Tournament" />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="edition" label="Edition" />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent label="Name" fieldName="name" />
              </TableHead>
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
                <ActionsCellDropDown editHref={`/dashboard/groups/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={4} />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Groups Found" />
      )}
    </>
  );
}
