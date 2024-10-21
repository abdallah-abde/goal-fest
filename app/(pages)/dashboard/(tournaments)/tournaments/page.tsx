import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import {
  FlagFilterOptions,
  SortDirectionOptions,
  TournamentTypes,
} from "@/types/enums";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";
import SortByList from "@/components/table-parts/SortByList";
import PopularSwitcher from "@/components/table-parts/PopularSwitcher";
import Filters from "@/components/table-parts/filters/Filters";

export default async function DashboardTournamentsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: string;
    isPopular?: string;
    type?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const isPopularCondition = searchParams?.isPopular;
  const typeCondition = searchParams?.type || "all";

  const where = {
    name: { contains: query },
    ...(isPopularCondition
      ? {
          isPopular:
            isPopularCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(typeCondition !== "all"
      ? {
          type: typeCondition,
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "type"
      ? { type: sortDir }
      : sortField === "isPopular"
      ? { isPopular: sortDir }
      : {}),
  };

  const totalTournamentsCount = await prisma.tournament.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalTournamentsCount / PAGE_RECORDS_COUNT);

  const tournaments = await prisma.tournament.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
  });

  const sortingList = [
    { label: "Name", fieldName: "name" },
    { label: "Type", fieldName: "type" },
    {
      label: "Is Popular",
      fieldName: "isPopular",
    },
  ];

  const listFilters = [
    {
      title: "Type",
      fieldName: "type",
      searchParamName: "type",
      placeholder: "Choose Type...",
      options: Object.values(TournamentTypes),
    },
  ];

  const flagFilters = [
    {
      title: "Is Popular",
      defaultValue: "all",
      fieldName: "isPopular",
      searchParamName: "isPopular",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Yes",
          value: "yes",
        },
        {
          label: "No",
          value: "no",
        },
      ],
    },
  ];

  return (
    <>
      <PageHeader label="Tournaments List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters flagFilters={flagFilters} listFilters={listFilters} />
        <SearchFieldComponent placeholder="Search by tournament names ..." />
        <AddNewLinkComponent
          href="/dashboard/tournaments/new"
          label="Add New Tournament"
        />
      </div>
      {tournaments.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Type</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Popular
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map(({ id, name, type, isPopular }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">{type}</TableCell>
                <TableCell className="dashboard-table-cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <PopularSwitcher
                          id={id}
                          type="tournaments"
                          isPopular={isPopular}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to update popular status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <ActionsCellDropDown
                  editHref={`/dashboard/tournaments/${id}`}
                />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalTournamentsCount}
            totalPages={totalPages}
            colSpan={4}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Tournaments Found" />
      )}
    </>
  );
}
