import prisma from "@/lib/db";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, Trash2Icon } from "lucide-react";
import PaginationComponent from "@/components/paginationComponent";
import AddNewLink from "@/components/AddNewLink";
import SearchField from "@/components/SearchField";
import { PAGE_RECORDS_COUNT } from "@/lib/constants";
import NoDataFound from "@/components/NoDataFound";
import SortComponent from "@/components/SortComponent";
import { SortValues } from "@/typings/sortValues";

const DashboardTeamsPage = async ({
  searchParams,
}: {
  searchParams: { page?: string; query?: string; sort?: SortValues };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sort = searchParams?.sort || SortValues.ASC;

  const totalTeamsCount = await prisma.team.count({
    where: { name: { contains: query } },
  });
  const totalPages = Math.ceil(totalTeamsCount / PAGE_RECORDS_COUNT);

  const teams = await prisma.team.findMany({
    where: { name: { contains: query } },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { name: sort },
  });

  return (
    <>
      <div className='flex items-center gap-2 mt-1'>
        <SearchField />
        <AddNewLink href='/dashboard/teams/new' label='Add New Team' />
      </div>
      {teams.length > 0 ? (
        <Table
          className={
            "mt-4 mb-2 caption-bottom dark:border-primary/10  border-0"
          }
        >
          <TableHeader>
            <TableRow className='bg-primary/10 hover:bg-primary/10 border-0'>
              <TableHead className='text-left flex gap-2 items-center'>
                <SortComponent />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow
                key={team.id}
                className='border-b-[1px] border-b-primary/10'
              >
                <TableCell className='text-left font-bold max-w-50%'>
                  {team.name}
                </TableCell>
                <TableCell className='flex gap-3 w-fit ml-auto'>
                  <Button
                    asChild
                    size='icon'
                    variant='outline'
                    className='border-outline/25 hover:bg-bluish hover:text-bluish-foreground transition duration-200'
                  >
                    <Link href={`/dashboard/teams/${team.id}`}>
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
        <NoDataFound message='No Teams Found' />
      )}
    </>
  );
};

export default DashboardTeamsPage;
