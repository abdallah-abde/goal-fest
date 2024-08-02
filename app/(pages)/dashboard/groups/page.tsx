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
import { Button } from "@/components/ui/button";

import { Pencil, Trash2Icon } from "lucide-react";

import AddNewLinkComponent from "@/components/AddNewLinkComponent";
import SearchFieldComponent from "@/components/SearchFieldComponent";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SortComponent from "@/components/SortComponent";
import PaginationComponent from "@/components/PaginationComponent";

export default async function DashboardGroupsPage({
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

  const totalGroupsCount = await prisma.group.count({
    where: {
      OR: [
        { tournamentEdition: { tournament: { name: { contains: query } } } },
        { tournamentEdition: { yearAsString: { contains: query } } },
        { name: { contains: query } },
      ],
    },
  });
  const totalPages = Math.ceil(totalGroupsCount / PAGE_RECORDS_COUNT);

  let groups;
  if (sortField === "tournament") {
    groups = await prisma.group.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { name: { contains: query } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { tournamentEdition: { tournament: { name: sortDir } } },
      include: {
        teams: true,
        tournamentEdition: {
          include: {
            tournament: true,
          },
        },
      },
    });
  } else if (sortField === "edition") {
    groups = await prisma.group.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { name: { contains: query } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { tournamentEdition: { year: sortDir } },
      include: {
        teams: true,
        tournamentEdition: {
          include: {
            tournament: true,
          },
        },
      },
    });
  } else {
    groups = await prisma.group.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { name: { contains: query } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { name: sortDir },
      include: {
        teams: true,
        tournamentEdition: {
          include: {
            tournament: true,
          },
        },
      },
    });
  }

  return (
    <>
      <div className='flex flex-col-reverse md:flex-row items-center gap-2 mt-1'>
        <SearchFieldComponent />
        <AddNewLinkComponent
          href='/dashboard/groups/new'
          label='Add New Group'
        />
      </div>
      {groups.length > 0 ? (
        <Table className='mt-4 mb-2 caption-bottom dark:border-primary/10 border-0 relative'>
          <TableHeader>
            <TableRow className='bg-primary/10 hover:bg-primary/10 border-0'>
              <TableHead className='text-left'>
                <SortComponent fieldName='tournament' label='Tournament' />
              </TableHead>
              <TableHead className='text-left'>
                <SortComponent fieldName='edition' label='Edition' />
              </TableHead>
              <TableHead className='text-left'>
                <SortComponent label='Name' fieldName='name' />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((grp) => (
              <TableRow
                key={grp.id}
                className='border-b-[1px] border-b-primary/10'
              >
                <TableCell className='text-left font-bold'>
                  {grp.tournamentEdition.tournament.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {grp.tournamentEdition.year.toString()}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {grp.name}
                </TableCell>
                <TableCell>
                  <div className='flex gap-3 w-fit ml-auto'>
                    <Button
                      asChild
                      size='icon'
                      variant='outline'
                      className='border-outline/25 hover:bg-bluish hover:text-bluish-foreground transition duration-200'
                    >
                      <Link href={`/dashboard/groups/${grp.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <Button
                      size='icon'
                      variant='outline'
                      className='border-outline/25 hover:bg-redish hover:text-redish-foreground transition duration-200'
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
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
        <NoDataFoundComponent message='No Groups Found' />
      )}
    </>
  );
}
