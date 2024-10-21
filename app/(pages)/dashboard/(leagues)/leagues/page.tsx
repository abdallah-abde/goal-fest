import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import {
  FlagFilterOptions,
  SortDirectionOptions,
  LeagueTypes,
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
import NotProvidedSpan from "@/components/NotProvidedSpan";

export default async function DashboardleaguesPage({
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
    OR: [
      { name: { contains: query } },
      { country: { name: { contains: query } } },
    ],
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

  const sortingList = [
    { label: "Name", fieldName: "name" },
    { label: "Country", fieldName: "country" },
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
      options: Object.values(LeagueTypes),
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
      <PageHeader label="leagues List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters flagFilters={flagFilters} listFilters={listFilters} />
        <SearchFieldComponent placeholder="Search by league names, countries ..." />
        <AddNewLinkComponent
          href="/dashboard/leagues/new"
          label="Add New League"
        />
      </div>
      {leagues.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Country
              </TableHead>
              <TableHead className="dashboard-head-table-cell">Type</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Popular
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leagues.map(({ id, name, country, type, isPopular }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {country?.name || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">{type}</TableCell>
                <TableCell className="dashboard-table-cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <PopularSwitcher
                          id={id}
                          type="leagues"
                          isPopular={isPopular}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to update popular status</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <ActionsCellDropDown editHref={`/dashboard/leagues/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalLeaguesCount}
            totalPages={totalPages}
            colSpan={5}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No leagues Found" />
      )}
    </>
  );
}
