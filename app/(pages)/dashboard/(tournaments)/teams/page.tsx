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
import SortByList from "@/components/table-parts/SortByList";

export default async function DashboardTeamsPage({
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
    OR: [{ name: { contains: query } }, { code: { contains: query } }],
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "code"
      ? { code: sortDir }
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
  ];

  return (
    <>
      <PageHeader label="Teams List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <SearchFieldComponent />
        <AddNewLinkComponent href="/dashboard/teams/new" label="Add New Team" />
      </div>
      {teams.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Code</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map(({ id, name, code }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">{code}</TableCell>
                <ActionsCellDropDown editHref={`/dashboard/teams/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalTeamsCount}
            totalPages={totalPages}
            colSpan={3}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Teams Found" />
      )}
    </>
  );
}
