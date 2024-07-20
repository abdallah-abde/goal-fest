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

const DashboardTournamentsEditionsPage = async () => {
  const editions = await prisma.tournamentEdition.findMany({
    include: {
      tournament: true,
      hostingCountries: true,
    },
  });

  return (
    <>
      <Link
        href='/dashboard/editions/new'
        className='ml-auto flex items-center gap-x-2 text-sm border w-fit p-2 rounded-sm hover:bg-primary/10 transition duration-200'
      >
        <Plus className='size-5' />
        <span>Add New Edition</span>
      </Link>
      {editions.length > 0 ? (
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[25%] text-left'>Name</TableHead>
              <TableHead className='w-[25%] text-left'>Year</TableHead>
              <TableHead className='w-[15%] text-left'>
                Knockout Matches
              </TableHead>
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
                  <Link href={`/dashboard/editions/${edi.id}/knockout-matches`}>
                    Knockout Matches
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
