import Link from "next/link";

import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionValues } from "@/typings/sortValues";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EllipsisVertical } from "lucide-react";

import AddNewLinkComponent from "@/components/AddNewLinkComponent";
import SearchFieldComponent from "@/components/SearchFieldComponent";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SortComponent from "@/components/SortComponent";
import PaginationComponent from "@/components/PaginationComponent";
import PageHeader from "@/components/PageHeader";

export default async function DashboardCountriesPage({
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
  const sortField = searchParams?.sortField || "name";

  const totalCountriesCount = await prisma.country.count({
    where: { name: { contains: query } },
  });
  const totalPages = Math.ceil(totalCountriesCount / PAGE_RECORDS_COUNT);

  const countries = await prisma.country.findMany({
    where: { name: { contains: query } },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { name: sortDir },
  });

  // await new Promise((resolve) => {
  //   setTimeout(() => {}, 300);
  // });

  return (
    <>
      <PageHeader label='Countries List' />
      <div className='flex flex-col-reverse md:flex-row items-center gap-2 mt-1'>
        <SearchFieldComponent />
        <AddNewLinkComponent
          href='/dashboard/countries/new'
          label='Add New Country'
        />
      </div>
      {countries.length > 0 ? (
        <Table className='mt-4 mb-2 caption-bottom dark:border-primary/10 border-0 relative'>
          <TableHeader>
            <TableRow className='bg-primary/10 hover:bg-primary/10 border-0'>
              <TableHead className='text-left flex gap-2 items-center'>
                <SortComponent fieldName='name' />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((cou) => (
              <TableRow
                key={cou.id}
                className='border-b-[1px] border-b-primary/10'
              >
                <TableCell className='text-left font-bold max-w-50%'>
                  {cou.name}
                </TableCell>
                <TableCell className='text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='min-w-fit cursor-pointer'>
                      <DropdownMenuItem
                        asChild
                        className='items-center justify-center'
                      >
                        <Link
                          href={`/dashboard/countries/${cou.id}`}
                          className='w-14 cursor-pointer'
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className='items-center justify-center'
                      >
                        <p className='w-14 cursor-pointer'>Delete</p>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {totalPages > 1 && (
            <TableFooter>
              <TableRow className='border-t-[1px] border-t-primary/10'>
                <TableCell colSpan={9}>
                  <PaginationComponent totalPages={totalPages} />
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      ) : (
        <NoDataFoundComponent message='No Countries Found' />
      )}
    </>
  );
}
