import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionValues } from "@/typings/sortValues";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFormattedDateTime } from "@/lib/getFormattedDate";

import AddNewLinkComponent from "@/components/AddNewLinkComponent";
import SearchFieldComponent from "@/components/SearchFieldComponent";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import SortComponent from "@/components/SortComponent";
import PageHeader from "@/components/PageHeader";
import DashboardTableFooter from "@/components/tables/DashboardTableFooter";
import ActionsCellDropDown from "@/components/tables/ActionsCellDropDown";

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
      <PageHeader label='Knockout Matches List' />
      <div className='dashboard-search-and-add'>
        <SearchFieldComponent />
        <AddNewLinkComponent
          href='/dashboard/knockout-matches/new'
          label='Add New Match'
        />
      </div>

      {matches.length > 0 ? (
        <Table className='dashboard-table'>
          <TableHeader>
            <TableRow className='dashboard-head-table-row text-[12px]'>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='homeTeam' label='Home Team' />
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='awayTeam' label='Away Team' />
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                Main Time
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                Extra Time
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                Penalties
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='date' label='Date & Time' />
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='round' label='Round' />
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='tournament' label='Tournament' />
              </TableHead>
              <TableHead className='dashboard-head-table-cell'>
                <SortComponent fieldName='edition' label='Edition' />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='text-[12px]'>
            {matches.map(
              ({
                id,
                homeTeam,
                awayTeam,
                homeGoals,
                awayGoals,
                homeExtraTimeGoals,
                awayExtraTimeGoals,
                homeTeamPlacehlder,
                awayTeamPlacehlder,
                homePenaltyGoals,
                awayPenaltyGoals,
                date,
                round,
                tournamentEdition,
              }) => (
                <TableRow key={id} className='dashboard-table-row'>
                  <TableCell className='dashboard-table-cell'>
                    {homeTeam ? homeTeam.name : homeTeamPlacehlder}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {awayTeam ? awayTeam.name : awayTeamPlacehlder}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {homeGoals} - {awayGoals}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {homeExtraTimeGoals} - {awayExtraTimeGoals}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {homePenaltyGoals} - {awayPenaltyGoals}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {date ? getFormattedDateTime(date.toString()) : ""}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {round}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {tournamentEdition.tournament.name}
                  </TableCell>
                  <TableCell className='dashboard-table-cell'>
                    {tournamentEdition.year.toString()}
                  </TableCell>
                  <ActionsCellDropDown
                    editHref={`/dashboard/knockout-matches/${id}`}
                  />
                </TableRow>
              )
            )}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={10} />
        </Table>
      ) : (
        <NoDataFoundComponent message='No Matches Found' />
      )}
    </>
  );
}
