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

export default async function DashboardTournamentsPage({
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
  // const sortField = searchParams?.sortField || "name";

  const totalTournamentsCount = await prisma.tournament.count({
    where: { name: { contains: query } },
  });
  const totalPages = Math.ceil(totalTournamentsCount / PAGE_RECORDS_COUNT);

  const tournaments = await prisma.tournament.findMany({
    where: { name: { contains: query } },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { name: sortDir },
  });

  return (
    <>
      <PageHeader label='Tournaments List' />
      <div className='dashboard-search-and-add'>
        <SearchFieldComponent />
        <AddNewLinkComponent
          href='/dashboard/tournaments/new'
          label='Add New Tournament'
        />
      </div>
      {tournaments.length > 0 ? (
        <Table className='dashboard-table'>
          <TableHeader>
            <TableRow className='dashboard-head-table-row'>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='name' />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map(({ id, name }) => (
              <TableRow key={id} className='dashboard-table-row'>
                <TableCell className='dashboard-table-cell'>{name}</TableCell>
                <ActionsCellDropDown
                  editHref={`/dashboard/tournaments/${id}`}
                />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={2} />
        </Table>
      ) : (
        <NoDataFoundComponent message='No Tournaments Found' />
      )}
    </>
  );
}
