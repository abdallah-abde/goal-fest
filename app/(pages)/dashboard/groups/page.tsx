import prisma from "@/lib/db";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil, Trash2Icon, Plus } from "lucide-react";

const DashboardTournamentsGroupsPage = async () => {
  const groups = await prisma.group.findMany({
    include: {
      teams: true,
      tournamentEdition: {
        include: {
          tournament: true,
        },
      },
    },
  });

  return (
    <>
      <Link
        href='/dashboard/groups/new'
        className='ml-auto flex items-center gap-x-2 text-sm border w-fit p-2 rounded-sm hover:bg-primary/10 transition duration-200'
      >
        <Plus className='size-5' />
        <span>Add New Group</span>
      </Link>
      {groups.length > 0 ? (
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[45%] text-left'>Name</TableHead>
              <TableHead className='w-[45%] text-left'>
                Tournament Edition
              </TableHead>
              <TableHead className='w-[5%]'>Edit</TableHead>
              <TableHead className='w-[5%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((grp) => (
              <TableRow key={grp.id}>
                <TableCell className='text-left font-bold'>
                  {grp.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {`${
                    grp.tournamentEdition.tournament.name
                  } ${grp.tournamentEdition.year.toString()}`}
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link href={`/dashboard/groups/${grp.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant='secondary'>
                    <Trash2Icon className='transition duration-200 hover:text-red-500' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No Groups Found</p>
      )}
    </>
  );
};

export default DashboardTournamentsGroupsPage;
