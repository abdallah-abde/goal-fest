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

const DashboardTournamentsPage = async () => {
  const tournaments = await prisma.tournament.findMany();

  return (
    <>
      <Button variant='default' asChild className='ml-auto block w-fit'>
        <Link href='/dashboard/tournaments/new'>Add New Tournament</Link>
      </Button>
      {tournaments.length > 0 ? (
        <Table className='my-8'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80%] text-left'>Name</TableHead>
              <TableHead className='w-[10%]'>Edit</TableHead>
              <TableHead className='w-[10%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell className='text-left font-bold'>
                  {tour.name}
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link href={`/dashboard/tournaments/${tour.id}`}>
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
        <p>No Tournaments Found</p>
      )}
    </>
  );
};

export default DashboardTournamentsPage;
