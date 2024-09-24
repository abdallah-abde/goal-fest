import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionValues } from "@/types/sortValues";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFormattedDateTime } from "@/lib/getFormattedDate";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import SortComponent from "@/components/table-parts/SortComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";

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
      <PageHeader label="Knockout Matches List" />
      <div className="dashboard-search-and-add">
        <SearchFieldComponent />
        <AddNewLinkComponent
          href="/dashboard/knockout-matches/new"
          label="Add New Match"
        />
      </div>

      {matches.length > 0 ? (
        <Table className="dashboard-table">
          <TableHeader>
            <TableRow className="dashboard-head-table-row text-[12px]">
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="homeTeam"
                  label="Home Team"
                  labelForSmallerDevices="HT"
                />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="awayTeam"
                  label="Away Team"
                  labelForSmallerDevices="AT"
                />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">MT</span>
                <span className="hidden sm:block">Main Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">ET</span>
                <span className="hidden sm:block">Extra Time</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <span className="hidden max-sm:block">Pen</span>
                <span className="hidden sm:block">Penalties</span>
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="date"
                  label="Date & Time"
                  labelForSmallerDevices="D&T"
                />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="round"
                  label="Round"
                  labelForSmallerDevices="Rnd"
                />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="tournament"
                  label="Tournament"
                  labelForSmallerDevices="Tour"
                />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="edition"
                  label="Edition"
                  labelForSmallerDevices="Edi"
                />
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[11px] sm:text-[12px]">
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
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">
                      {homeTeam ? homeTeam.code : homeTeamPlacehlder}
                    </span>
                    <span className="hidden sm:block">
                      {homeTeam ? homeTeam.name : homeTeamPlacehlder}
                    </span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">
                      {awayTeam ? awayTeam.code : awayTeamPlacehlder}
                    </span>
                    <span className="hidden sm:block">
                      {awayTeam ? awayTeam.name : awayTeamPlacehlder}
                    </span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {homeGoals} - {awayGoals}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {homeExtraTimeGoals} - {awayExtraTimeGoals}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {homePenaltyGoals} - {awayPenaltyGoals}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">
                      {date ? getFormattedDateTime(date.toString(), true) : ""}
                    </span>
                    <span className="hidden sm:block">
                      {date ? getFormattedDateTime(date.toString()) : ""}
                    </span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {round}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {tournamentEdition.tournament.name}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
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
        <NoDataFoundComponent message="No Matches Found" />
      )}
    </>
  );
}
