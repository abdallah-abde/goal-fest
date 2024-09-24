import prisma from "@/lib/db";
import Link from "next/link";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionValues } from "@/types/sortValues";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import SortComponent from "@/components/table-parts/SortComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";

export default async function DashboardEditionsPage({
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
  const sortField = searchParams?.sortField || "year";

  const totalEditionsCount = await prisma.tournamentEdition.count({
    where: {
      OR: [
        { tournament: { name: { contains: query } } },
        { yearAsString: { contains: query } },
      ],
    },
  });
  const totalPages = Math.ceil(totalEditionsCount / PAGE_RECORDS_COUNT);

  let editions;

  if (sortField === "name") {
    editions = await prisma.tournamentEdition.findMany({
      where: {
        OR: [
          { tournament: { name: { contains: query } } },
          { yearAsString: { contains: query } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { tournament: { name: sortDir } },
      include: {
        tournament: true,
        hostingCountries: true,
      },
    });
  } else {
    editions = await prisma.tournamentEdition.findMany({
      where: {
        OR: [
          { tournament: { name: { contains: query } } },
          { yearAsString: { contains: query } },
        ],
      },

      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { year: sortDir },
      include: {
        tournament: true,
        hostingCountries: true,
      },
    });
  }

  return (
    <>
      <PageHeader label="Tournaments Editions List" />
      <div className="dashboard-search-and-add">
        <SearchFieldComponent />
        <AddNewLinkComponent
          href="/dashboard/editions/new"
          label="Add New Edition"
        />
      </div>
      {editions.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="name" />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent label="Year" fieldName="year" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editions.map(({ id, tournament: { name }, year }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {year.toString()}
                </TableCell>
                <ActionsCellDropDown editHref={`/dashboard/editions/${id}`}>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="items-center justify-center"
                  >
                    <Link
                      href={`/dashboard/editions/${id}/update-current-stage`}
                      className="w-full cursor-pointer"
                    >
                      Update Current Stage
                    </Link>
                  </DropdownMenuItem>
                </ActionsCellDropDown>
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={3} />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Editions Found" />
      )}
    </>
  );
}
