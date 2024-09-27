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

  const totalCountriesCount = await prisma.country.count({
    where: { name: { contains: query } },
  });
  const totalPages = Math.ceil(totalCountriesCount / PAGE_RECORDS_COUNT);

  let countries;

  if (sortField === "name") {
    countries = await prisma.country.findMany({
      where: {
        OR: [{ name: { contains: query } }, { code: { contains: query } }],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { name: sortDir },
    });
  } else {
    countries = await prisma.country.findMany({
      where: {
        OR: [{ name: { contains: query } }, { code: { contains: query } }],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { code: sortDir },
    });
  }

  // await new Promise((resolve) => {
  //   setTimeout(() => {}, 300);
  // });

  return (
    <>
      <PageHeader label='Countries List' />
      <div className='dashboard-search-and-add'>
        <SearchFieldComponent />
        <AddNewLinkComponent
          href='/dashboard/countries/new'
          label='Add New Country'
        />
      </div>
      {countries.length > 0 ? (
        <Table className='dashboard-table'>
          <TableHeader>
            <TableRow className='dashboard-head-table-row'>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='name' />
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent label='Country Code' fieldName='code' />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map(({ id, name, code }) => (
              <TableRow key={id} className='dashboard-table-row'>
                <TableCell className='dashboard-table-cell'>{name}</TableCell>
                <TableCell className='dashboard-table-cell'>{code}</TableCell>
                <ActionsCellDropDown editHref={`/dashboard/countries/${id}`} />
              </TableRow>
            ))}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={3} />
        </Table>
      ) : (
        <NoDataFoundComponent message='No Countries Found' />
      )}
    </>
  );
}
