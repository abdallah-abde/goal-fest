import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { Continents, SortDirectionOptions } from "@/types/enums";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import SortByList from "@/components/table-parts/SortByList";
import Filters from "@/components/table-parts/Filters";
import NotProvidedSpan from "@/components/NotProvidedSpan";

import CountryForm from "@/components/forms/CountryForm";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardCountriesPage({
  searchParams,
}: {
  searchParams: {
    page?: string | null;
    query?: string | null;
    sortDir?: SortDirectionOptions | null;
    sortField?: string | null;
    continent?: string | null;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "name";
  const continentCondition = searchParams?.continent || "all";

  const where = {
    OR: [{ name: { contains: query } }, { code: { contains: query } }],
    ...(continentCondition !== "all"
      ? {
          continent: continentCondition,
        }
      : {}),
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "code"
      ? { code: sortDir }
      : sortField === "continent"
      ? { continent: sortDir }
      : {}),
  };

  const totalCountriesCount = await prisma.country.count({
    where: { ...where },
  });

  const totalPages = Math.ceil(totalCountriesCount / PAGE_RECORDS_COUNT);

  const countries = await prisma.country.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
  });

  // await new Promise((resolve) => {
  //   setTimeout(() => {}, 300);
  // });

  const sortingList = [
    { label: "Name", fieldName: "name" },
    { label: "Code", fieldName: "code" },
    { label: "Continent", fieldName: "continent" },
  ];

  const listFilters = [
    {
      title: "Continent",
      fieldName: "continent",
      searchParamName: "continent",
      placeholder: "Choose Continent...",
      options: Object.values(Continents),
    },
  ];

  return (
    <>
      <PageHeader label="Countries List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <Filters listFilters={listFilters} />
        <SearchFieldComponent placeholder="Search by country names, codes ..." />
        <FormDialog id={null} />
      </div>
      {countries.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Code</TableHead>
              <TableHead className="dashboard-head-table-cell">
                Continent
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map(({ id, name, code, continent }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {code || <NotProvidedSpan />}
                </TableCell>
                <TableCell className="dashboard-table-cell">
                  {continent || <NotProvidedSpan />}
                </TableCell>
                <TableCell>
                  <FormDialog id={id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalCountriesCount}
            totalPages={totalPages}
            colSpan={4}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Countries Found" />
      )}
    </>
  );
}

async function FormDialog({ id }: { id: number | null }) {
  const country = id
    ? await prisma.country.findUnique({
        where: { id },
      })
    : null;

  if (id && !country) throw new Error("Something went wrong");

  return (
    <Dialog>
      <DialogTrigger>
        {country == null ? (
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
        <CountryForm country={country} />
      </DialogContent>
    </Dialog>
  );
}
