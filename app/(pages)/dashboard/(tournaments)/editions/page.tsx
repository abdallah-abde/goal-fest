import prisma from "@/lib/db";
import Link from "next/link";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionOptions, TournamentStages } from "@/types/enums";

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
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/filters/Filters";

export default async function DashboardEditionsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: string;
    stage?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "year";
  const stageCondition = searchParams?.stage || "all";

  const where = {
    OR: [
      { tournament: { name: { contains: query } } },
      { year: { contains: query } },
      { winner: { name: { contains: query } } },
      { titleHolder: { name: { contains: query } } },
      // { currentStage: { contains: query } },
    ],
    ...(stageCondition !== "all"
      ? {
          currentStage: stageCondition,
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "name"
      ? { tournament: { name: sortDir } }
      : sortField === "year"
      ? { year: sortDir }
      : sortField === "winner"
      ? { winner: { name: sortDir } }
      : sortField === "titleHolder"
      ? { titleHolder: { name: sortDir } }
      : sortField === "currentStage"
      ? { currentStage: sortDir }
      : {}),
  };

  const totalEditionsCount = await prisma.tournamentEdition.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalEditionsCount / PAGE_RECORDS_COUNT);

  const editions = await prisma.tournamentEdition.findMany({
    where: {
      ...where,
    },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
    include: {
      tournament: true,
      hostingCountries: true,
      winner: true,
      titleHolder: true,
    },
  });

  const sortingList = [
    { label: "Name", fieldName: "name" },
    { label: "Year", fieldName: "year" },
    {
      label: "Winner",
      fieldName: "winner",
    },
    {
      label: "Title Holder",
      fieldName: "titleHolder",
    },
    {
      label: "Current Stage",
      fieldName: "currentStage",
    },
  ];

  const listFilters = [
    {
      title: "Stage",
      fieldName: "stage",
      searchParamName: "stage",
      placeholder: "Choose Stage...",
      options: Object.values(TournamentStages),
    },
  ];

  return (
    <>
      <PageHeader label="Tournaments Editions List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters listFilters={listFilters} />
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
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Year</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Winner
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Title Holder
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Stage</TableHead>
              <TableHead className="dashboard-head-table-cell">Slug</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editions.map(
              ({
                id,
                tournament: { name },
                year,
                winner,
                titleHolder,
                currentStage,
                slug,
              }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">{name}</TableCell>
                  <TableCell className="dashboard-table-cell">
                    {year.toString()}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {winner?.name || "..."}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {titleHolder?.name || "..."}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {currentStage || "..."}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">{slug}</TableCell>
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
              )
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalEditionsCount}
            totalPages={totalPages}
            colSpan={5}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Editions Found" />
      )}
    </>
  );
}
