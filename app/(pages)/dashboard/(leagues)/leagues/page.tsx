import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import {
  FlagFilterOptions,
  SortDirectionOptions,
  Continents,
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/Filters";
import NotProvidedSpan from "@/components/NotProvidedSpan";
import FieldSwitcher from "@/components/table-parts/FieldSwitcher";

import LeagueForm from "@/components/forms/LeagueForm";

import { Country } from "@prisma/client";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardleaguesPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
    continent?: string | null;
    country?: string | null;
    isPopular?: string | null;
    isClubs?: string | null;
    isDomestic?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const isPopularCondition = searchParams?.isPopular;
  const isClubsCondition = searchParams?.isClubs;
  const isDomesticCondition = searchParams?.isDomestic;
  const continentCondition = searchParams?.continent || "all";
  const countryCondition = searchParams?.country || "all";

  const where = {
    OR: [
      { name: { contains: query } },
      { country: { name: { contains: query } } },
      { continent: { contains: query } },
    ],
    ...(isPopularCondition
      ? {
          isPopular:
            isPopularCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(isClubsCondition
      ? {
          isClubs:
            isClubsCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(isDomesticCondition
      ? {
          isDomestic:
            isDomesticCondition === FlagFilterOptions.Yes.toLowerCase()
              ? true
              : false,
        }
      : {}),
    ...(continentCondition !== "all"
      ? {
          continent: continentCondition,
        }
      : {}),
    ...(countryCondition !== "all"
      ? {
          country: { name: countryCondition },
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "country"
      ? { country: { name: sortDir } }
      : sortField === "continent"
      ? { continent: sortDir }
      : sortField === "isPopular"
      ? { isPopular: sortDir }
      : sortField === "isClubs"
      ? { isClubs: sortDir }
      : sortField === "isDomestic"
      ? { isDomestic: sortDir }
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
    { label: "Continent", fieldName: "continent" },
    {
      label: "Is Popular",
      fieldName: "isPopular",
    },
    {
      label: "Is Clubs",
      fieldName: "isClubs",
    },
    {
      label: "Is Domestic",
      fieldName: "isDomestic",
    },
  ];

  const countries = await prisma.country.findMany();

  const listFilters = [
    {
      title: "Continent",
      fieldName: "continent",
      searchParamName: "continent",
      placeholder: "Choose continent...",
      options: Object.values(Continents),
    },
    // {
    //   title: "Country",
    //   fieldName: "country",
    //   searchParamName: "country",
    //   placeholder: "Choose country...",
    //   options: countries.map((a) => a.name),
    // },
  ];

  const textFilters = [
    {
      title: "Country",
      fieldName: "country",
      searchParamName: "country",
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
    {
      title: "Is Clubs",
      defaultValue: "all",
      fieldName: "isClubs",
      searchParamName: "isClubs",
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
    {
      title: "Is Domestic",
      defaultValue: "all",
      fieldName: "isDomestic",
      searchParamName: "isDomestic",
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
        <Filters
          flagFilters={flagFilters}
          listFilters={listFilters}
          textFilters={textFilters}
        />
        <SearchFieldComponent placeholder="Search by league name, country, continent ..." />
        <FormDialog id={null} />
      </div>
      {leagues.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Country
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Continent
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Popular
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Clubs
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                Is Domestic
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leagues.map(
              ({
                id,
                name,
                country,
                continent,
                isPopular,
                isClubs,
                isDomestic,
              }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">{name}</TableCell>
                  <TableCell className="dashboard-table-cell">
                    {country?.name || <NotProvidedSpan />}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {continent}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FieldSwitcher
                            id={id}
                            type="leagues"
                            value={isPopular}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update popular status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FieldSwitcher
                            id={id}
                            type="leagues"
                            value={isClubs}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update clubs status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <FieldSwitcher
                            id={id}
                            type="leagues"
                            value={isDomestic}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to update domestic status</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <FormDialog id={id} />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalLeaguesCount}
            totalPages={totalPages}
            colSpan={7}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No leagues Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const league = id
    ? await prisma.league.findUnique({
        where: { id },
        include: {
          country: true,
        },
      })
    : null;

  if (id && !league) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {league == null ? (
          <Button variant="outline" size="icon">
            <Plus className="size-5" />
          </Button>
        ) : (
          <Button variant="outline" size="icon">
            <Pencil className="size-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full md:w-3/4 lg:w-2/3 h-3/4">
        <LeagueForm league={league} />
      </DialogContent>
    </Dialog>
  );
}
