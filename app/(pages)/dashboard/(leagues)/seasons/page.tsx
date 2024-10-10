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

export default async function DashboardSeasonsPage({
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
  const sortField = searchParams?.sortField || "year";

  const where = {
    OR: [
      { league: { name: { contains: query } } },
      { year: { contains: query } },
    ],
  };

  const orderBy = {
    ...(sortField === "name"
      ? { league: { name: sortDir } }
      : sortField === "year"
      ? { year: sortDir }
      : {}),
  };

  const totalSeasonsCount = await prisma.leagueSeason.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalSeasonsCount / PAGE_RECORDS_COUNT);

  const seasons = await prisma.leagueSeason.findMany({
    where: {
      ...where,
    },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      league: true,
    },
  });

  return (
    <>
      <PageHeader label="Leagues Seasons List" />
      <div className="dashboard-search-and-add">
        <SearchFieldComponent />
        <AddNewLinkComponent
          href="/dashboard/seasons/new"
          label="Add New Season"
        />
      </div>
      {seasons.length > 0 ? (
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
            {seasons.map(({ id, league: { name }, year }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">{year}</TableCell>
                <ActionsCellDropDown editHref={`/dashboard/seasons/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={3} />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Seasons Found" />
      )}
    </>
  );
}
