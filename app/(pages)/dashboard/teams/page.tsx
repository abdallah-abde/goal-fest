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

const DashboardTeamsPage = async () => {
  const teams = await prisma.team.findMany();

  return (
    <>
      <Link
        href='/dashboard/teams/new'
        className='ml-auto flex items-center gap-x-2 text-sm border w-fit p-2 rounded-sm hover:bg-primary/10 transition duration-200'
      >
        <Plus className='size-5' />
        <span>Add New Team</span>
      </Link>
      {teams.length > 0 ? (
        <Table className='mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80%] text-left'>Name</TableHead>
              <TableHead className='w-[10%]'>Edit</TableHead>
              <TableHead className='w-[10%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className='text-left font-bold'>
                  {team.name}
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link href={`/dashboard/teams/${team.id}`}>
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
        <p>No Teams Found</p>
      )}
    </>
  );
};

export default DashboardTeamsPage;
