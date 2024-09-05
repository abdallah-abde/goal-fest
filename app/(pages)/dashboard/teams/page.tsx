import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionValues } from "@/typings/sortValues";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AddNewLinkComponent from "@/components/AddNewLinkComponent";
import SearchFieldComponent from "@/components/SearchFieldComponent";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SortComponent from "@/components/SortComponent";
import PageHeader from "@/components/PageHeader";
import DashboardTableFooter from "@/components/tables/DashboardTableFooter";
import ActionsCellDropDown from "@/components/tables/ActionsCellDropDown";

export default async function DashboardTeamsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionValues;
    sortField?: String;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionValues.ASC;
  // const sortField = searchParams?.sortField || "name";

  const totalTeamsCount = await prisma.team.count({
    where: { name: { contains: query } },
  });
  const totalPages = Math.ceil(totalTeamsCount / PAGE_RECORDS_COUNT);

  const teams = await prisma.team.findMany({
    where: { name: { contains: query } },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { name: sortDir },
  });

  return (
    <>
      <PageHeader label='Teams List' />
      <div className='dashboard-search-and-add'>
        <SearchFieldComponent />
        <AddNewLinkComponent href='/dashboard/teams/new' label='Add New Team' />
      </div>
      {teams.length > 0 ? (
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
            {teams.map(({ id, name }) => (
              <TableRow key={id} className='dashboard-table-row'>
                <TableCell className='dashboard-table-cell'>{name}</TableCell>
                <ActionsCellDropDown editHref={`/dashboard/teams/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={2} />
        </Table>
      ) : (
        <NoDataFoundComponent message='No Teams Found' />
      )}
    </>
  );
}
