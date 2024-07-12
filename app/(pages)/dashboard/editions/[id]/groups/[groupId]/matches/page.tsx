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
import { getFormattedDateTime } from "@/lib/getFormattedDate";

const DashboardTournamentsGroupMatchesPage = async ({
  params,
}: {
  params: { id: string; groupId: string };
}) => {
  const matches = await prisma.match.findMany({
    where: {
      groupId: +params.groupId,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
      tournamentEdition: {
        include: {
          tournament: true,
        },
      },
    },
  });

  return (
    <div className='mb-24'>
      <Button variant='default' asChild className='ml-auto block w-fit'>
        <Link
          href={`/dashboard/editions/${params.id}/groups/${params.groupId}/matches/new`}
        >
          Add New Match
        </Link>
      </Button>
      {matches.length > 0 ? (
        <Table className='my-8'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[15%] text-left'>Home team</TableHead>
              <TableHead className='w-[15%] text-left'>Away team</TableHead>
              <TableHead className='w-[10%] text-left'>Home Goals</TableHead>
              <TableHead className='w-[10%] text-left'>Away Goals</TableHead>
              <TableHead className='w-[15%] text-left'>Date & Time</TableHead>
              <TableHead className='w-[15%] text-left'>
                Tournament Edition
              </TableHead>
              <TableHead className='w-[10%]'>Edit</TableHead>
              <TableHead className='w-[10%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((mch) => (
              <TableRow key={mch.id}>
                <TableCell className='text-left font-bold'>
                  {mch.homeTeam.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayTeam.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homeGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.date ? getFormattedDateTime(mch.date.toString()) : ""}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {`${mch.tournamentEdition.tournament.name} ${mch.tournamentEdition.year}`}
                </TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant='secondary'
                    className='transition duration-200 hover:text-blue-500 '
                  >
                    <Link
                      href={`/dashboard/editions/${params.id}/groups/${mch.groupId}/matches/${mch.id}`}
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
        <p>No Matches Found</p>
      )}
    </div>
  );
};

export default DashboardTournamentsGroupMatchesPage;
