import Link from "next/link";

import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionValues } from "@/typings/sortValues";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2Icon } from "lucide-react";

import { getFormattedDateTime } from "@/lib/getFormattedDate";

import AddNewLinkComponent from "@/components/AddNewLinkComponent";
import SearchFieldComponent from "@/components/SearchFieldComponent";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SortComponent from "@/components/SortComponent";
import PaginationComponent from "@/components/PaginationComponent";

export default async function DashboardKnockoutMatchesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionValues;
    sortField?: String;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionValues.ASC;
  const sortField = searchParams?.sortField || "date";

  const totalMatchesCount = await prisma.knockoutMatch.count({
    where: {
      OR: [
        { tournamentEdition: { tournament: { name: { contains: query } } } },
        { tournamentEdition: { yearAsString: { contains: query } } },
        { homeTeam: { name: { contains: query } } },
        { awayTeam: { name: { contains: query } } },
      ],
    },
  });
  const totalPages = Math.ceil(totalMatchesCount / PAGE_RECORDS_COUNT);

  let matches;

  if (sortField === "tournament") {
    matches = await prisma.knockoutMatch.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { homeTeam: { name: { contains: query } } },
          { awayTeam: { name: { contains: query } } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { tournamentEdition: { tournament: { name: sortDir } } },
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
  } else if (sortField === "edition") {
    matches = await prisma.knockoutMatch.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { homeTeam: { name: { contains: query } } },
          { awayTeam: { name: { contains: query } } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { tournamentEdition: { year: sortDir } },
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
  } else if (sortField === "homeTeam") {
    matches = await prisma.knockoutMatch.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { homeTeam: { name: { contains: query } } },
          { awayTeam: { name: { contains: query } } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { homeTeam: { name: sortDir } },
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
  } else if (sortField === "awayTeam") {
    matches = await prisma.knockoutMatch.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { homeTeam: { name: { contains: query } } },
          { awayTeam: { name: { contains: query } } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { awayTeam: { name: sortDir } },
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
  } else if (sortField === "round") {
    matches = await prisma.knockoutMatch.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { homeTeam: { name: { contains: query } } },
          { awayTeam: { name: { contains: query } } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { round: sortDir },
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
  } else {
    matches = await prisma.knockoutMatch.findMany({
      where: {
        OR: [
          { tournamentEdition: { tournament: { name: { contains: query } } } },
          { tournamentEdition: { yearAsString: { contains: query } } },
          { homeTeam: { name: { contains: query } } },
          { awayTeam: { name: { contains: query } } },
        ],
      },
      skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
      take: PAGE_RECORDS_COUNT,
      orderBy: { date: sortDir },
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
  }

  return (
    <>
      <div className='flex flex-col-reverse md:flex-row items-center gap-2 mt-1'>
        <SearchFieldComponent />
        <AddNewLinkComponent
          href='/dashboard/knockout-matches/new'
          label='Add New Match'
        />
      </div>

      {matches.length > 0 ? (
        <Table className='mt-4 mb-2 caption-bottom dark:border-primary/10 border-0 relative'>
          <TableHeader>
            <TableRow className='bg-primary/10 hover:bg-primary/10 border-0 text-[12px]'>
              <TableHead className='text-left'>
                <SortComponent fieldName='homeTeam' label='Home Team' />
              </TableHead>
              <TableHead className='text-left'>
                <SortComponent fieldName='awayTeam' label='Away Team' />
              </TableHead>
              <TableHead className='text-left'>Main Time</TableHead>
              <TableHead className='text-left'>Extra Time</TableHead>
              <TableHead className='text-left'>Penalties</TableHead>
              <TableHead className='text-left'>
                <SortComponent fieldName='date' label='Date & Time' />
              </TableHead>
              <TableHead className='text-left'>
                <SortComponent fieldName='round' label='Round' />
              </TableHead>
              <TableHead className='text-left'>
                <SortComponent fieldName='tournament' label='Tournament' />
              </TableHead>
              <TableHead className='text-left'>
                <SortComponent fieldName='edition' label='Edition' />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-[12px]'>
            {matches.map((mch) => (
              <TableRow
                key={mch.id}
                className='border-b-[1px] border-b-primary/10'
              >
                <TableCell className='text-left font-bold'>
                  {mch.homeTeam ? mch.homeTeam.name : mch.homeTeamPlacehlder}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.awayTeam ? mch.awayTeam.name : mch.awayTeamPlacehlder}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homeGoals} - {mch.awayGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homeExtraTimeGoals} - {mch.awayExtraTimeGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.homePenaltyGoals} - {mch.awayPenaltyGoals}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.date ? getFormattedDateTime(mch.date.toString()) : ""}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.round}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.tournamentEdition.tournament.name}
                </TableCell>
                <TableCell className='text-left font-bold'>
                  {mch.tournamentEdition.year.toString()}
                </TableCell>
                <TableCell>
                  <div className='flex gap-3 w-fit ml-auto'>
                    <Button
                      asChild
                      size='xs'
                      variant='outline'
                      className='border-outline/25 hover:bg-bluish hover:text-bluish-foreground transition duration-200'
                    >
                      <Link href={`/dashboard/knockout-matches/${mch.id}`}>
                        <Pencil />
                      </Link>
                    </Button>
                    <Button
                      size='xs'
                      variant='outline'
                      className='border-outline/25 hover:bg-redish hover:text-redish-foreground transition duration-200'
                    >
                      {" "}
                      <Trash2Icon className='transition duration-200 hover:text-red-500' />
                    </Button>
                  </div>
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
        <NoDataFoundComponent message='No Matches Found' />
      )}
    </>
  );
}
