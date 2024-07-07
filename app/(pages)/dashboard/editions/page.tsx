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

const DashboardTournamentsEditionsPage = async () => {
  const editions = await prisma.tournamentEdition.findMany({
    include: {
      tournament: true,
    },
  });

  return (
    <>
      <Button variant='default' asChild className='ml-auto block w-fit'>
        <Link href='/dashboard/editions/new'>Add New Tournament Edition</Link>
      </Button>
      {editions.length > 0 ? (
        <Table className='my-8'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[30%] text-left'>Name</TableHead>
              <TableHead className='w-[30%] text-left'>Year</TableHead>
              <TableHead className='w-[20%] text-left'>Groups</TableHead>
              <TableHead className='w-[10%]'>Edit</TableHead>
              <TableHead className='w-[10%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editions.map((edi) => (
              <TableRow key={edi.id}>
                <TableCell className='text-left font-bold'>
                  {edi.tournament.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {edi.year.toString()}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  <Link href={`/dashboard/editions/${edi.id}/groups`}>
                    Groups
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link href={`/dashboard/editions/${edi.id}`}>
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
        <p>No Tournaments Editions Found</p>
      )}
    </>
  );
};

export default DashboardTournamentsEditionsPage;
