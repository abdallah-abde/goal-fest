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
import { Pencil, Trash2Icon } from "lucide-react";

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
    },
  });

  return (
    <>
      <Button variant='default' asChild className='ml-auto block w-fit'>
        <Link href={`/dashboard/editions/${params.id}/groups/new`}>
          Add New Group
        </Link>
      </Button>
      {groups.length > 0 ? (
        <Table className='my-8'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[40%] text-left'>Name</TableHead>
              <TableHead className='w-[40%] text-left'>
                Tournament Edition
              </TableHead>
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
