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

const DashboardTournamentsGroupsPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const groups = await prisma.group.findMany({
    where: {
      tournamentEditionId: +params.id,
    },
    include: {
      tournamentEdition: {
        include: {
          tournament: true,
        },
      },
      teams: true,
    },
  });

  return (
    <>
      <Link
        href={`/dashboard/editions/${params.id}/groups/new`}
        className='ml-auto flex items-center gap-x-2 text-sm border w-fit p-2 rounded-sm hover:bg-primary/10 transition duration-200'
      >
        <Plus className='size-5' />
        <span>Add New Group</span>
      </Link>

      {groups.length > 0 ? (
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[30%] text-left'>Name</TableHead>
              <TableHead className='w-[30%] text-left'>
                Tournament Edition
              </TableHead>
              <TableHead className='w-[20%] text-left'>Matches</TableHead>
              <TableHead className='w-[10%]'>Edit</TableHead>
              <TableHead className='w-[10%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((grp) => (
              <TableRow key={grp.id}>
                <TableCell className='text-left font-bold'>
                  {grp.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {`${grp.tournamentEdition.tournament.name} ${grp.tournamentEdition.year}`}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  <Link
                    href={`/dashboard/editions/${params.id}/groups/${grp.id}/matches`}
                  >
                    Matches
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link
                      href={`/dashboard/editions/${params.id}/groups/${grp.id}`}
                    >
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
