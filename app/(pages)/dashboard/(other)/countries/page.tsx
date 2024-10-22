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
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";
import SortByList from "@/components/table-parts/SortByList";
import NotProvidedSpan from "@/components/NotProvidedSpan";

export default async function DashboardCountriesPage({
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
    OR: [{ name: { contains: query } }, { code: { contains: query } }],
  };

  const orderBy = {
    ...(sortField === "name"
      ? { name: sortDir }
      : sortField === "code"
      ? { code: sortDir }
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
  ];

  return (
    <>
      <PageHeader label="Countries List" />
      <div className="dashboard-search-and-add">
        <SortByList list={sortingList} defaultField="name" />
        <SearchFieldComponent placeholder="Search by country names, codes ..." />
        <AddNewLinkComponent
          href="/dashboard/countries/new"
          label="Add New Country"
        />
      </div>
      {countries.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row">
              <TableHead className="dashboard-head-table-cell">Name</TableHead>
              <TableHead className="dashboard-head-table-cell">Code</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map(({ id, name, code }) => (
              <TableRow key={id} className="dashboard-table-row">
                <TableCell className="dashboard-table-cell">{name}</TableCell>
                <TableCell className="dashboard-table-cell">
                  {code || <NotProvidedSpan />}
                </TableCell>
                <ActionsCellDropDown editHref={`/dashboard/countries/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter
            totalCount={totalCountriesCount}
            totalPages={totalPages}
            colSpan={3}
          />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Countries Found" />
      )}
    </>
  );
}
