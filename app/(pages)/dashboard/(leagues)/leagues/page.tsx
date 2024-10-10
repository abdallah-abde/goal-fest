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

import { Check, X } from "lucide-react";

export default async function DashboardleaguesPage({
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
      { name: { contains: query } },
      { country: { name: { contains: query } } },
    ],
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "country"
      ? { country: { name: sortDir } }
      : sortField === "type"
      ? { type: sortDir }
      : sortField === "isPopular"
      ? { isPopular: sortDir }
      : {}),
  };

  const totalLeaguesCount = await prisma.league.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalLeaguesCount / PAGE_RECORDS_COUNT);

  const leagues = await prisma.league.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      country: true,
    },
  });

  return (
    <>
      <PageHeader label="leagues List" />
      <div className="dashboard-search-and-add">
        <SearchFieldComponent />
        <AddNewLinkComponent
          href="/dashboard/leagues/new"
          label="Add New League"
        />
      </div>
      {leagues.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="name" />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="country" label="Country" />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="type" label="Type" />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="isPopular" label="Is Popular" />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leagues.map(({ id, name, country, type, isPopular }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {country?.name || "No Country"}
                </TableCell>
                <TableCell className="dashboard-table-cell">{type}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {isPopular ? <Check /> : <X />}
                </TableCell>
                <ActionsCellDropDown editHref={`/dashboard/leagues/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={5} />
        </Table>
      ) : (
        <NoDataFoundComponent message="No leagues Found" />
      )}
    </>
  );
}
