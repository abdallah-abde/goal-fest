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

const DashboardTournamentsGroupKnockoutMatchesPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const matches = await prisma.knockoutMatch.findMany({
    where: {
      tournamentEditionId: +params.id,
    },
    include: {
      homeTeam: true,
      awayTeam: true,
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
        <Link href={`/dashboard/editions/${params.id}/knockout-matches/new`}>
          Add New Match
        </Link>
      </Button>
      {matches.length > 0 ? (
        <Table className='my-8'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-left'>Home team</TableHead>
              <TableHead className='text-left'>Away team</TableHead>
              <TableHead className='text-left'>Home MT Goals</TableHead>
              <TableHead className='text-left'>Away MT Goals</TableHead>
              <TableHead className='text-left'>Home ET Goals</TableHead>
              <TableHead className='text-left'>Away ET Goals</TableHead>
              <TableHead className='text-left'>Home Pen Goals</TableHead>
              <TableHead className='text-left'>Away Pen Goals</TableHead>
              <TableHead className='text-left'>Date & Time</TableHead>
              <TableHead className='text-left'>Round</TableHead>
              <TableHead className='text-left'>Tournament Edition</TableHead>
              <TableHead className='w-[5%]'>Edit</TableHead>
              <TableHead className='w-[5%]'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((mch) => (
              <TableRow key={mch.id}>
                <TableCell className='text-left font-bold'>
                  {mch.homeTeam ? mch.homeTeam.name : mch.homeTeamPlacehlder}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayTeam ? mch.awayTeam.name : mch.awayTeamPlacehlder}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homeGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homeExtraTimeGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayExtraTimeGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homePenaltyGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayPenaltyGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.date ? getFormattedDateTime(mch.date.toString()) : ""}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.round}
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
                      href={`/dashboard/editions/${params.id}/knockout-matches/${mch.id}`}
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

export default DashboardTournamentsGroupKnockoutMatchesPage;
