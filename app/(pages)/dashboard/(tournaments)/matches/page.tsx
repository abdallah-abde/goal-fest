import prisma from "@/lib/db";

import { PAGE_RECORDS_COUNT } from "@/lib/constants";

import { SortDirectionOptions } from "@/types/enums";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import SortComponent from "@/components/table-parts/SortComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";

import { Check, X } from "lucide-react";

export default async function DashboardGroupMatchesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    query?: string;
    sortDir?: SortDirectionOptions;
    sortField?: String;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortDir = searchParams?.sortDir || SortDirectionOptions.ASC;
  const sortField = searchParams?.sortField || "date";

  const where = {
    OR: [
      { tournamentEdition: { tournament: { name: { contains: query } } } },
      { tournamentEdition: { yearAsString: { contains: query } } },
      { homeTeam: { name: { contains: query } } },
      { awayTeam: { name: { contains: query } } },
    ],
  };

  const orderBy = {
    ...(sortField === "tournament"
      ? { tournamentEdition: { tournament: { name: sortDir } } }
      : sortField === "edition"
      ? { tournamentEdition: { year: sortDir } }
      : sortField === "homeTeam"
      ? { homeTeam: { name: sortDir } }
      : sortField === "awayTeam"
      ? { awayTeam: { name: sortDir } }
      : sortField === "group"
      ? { group: { name: sortDir } }
      : sortField === "round"
      ? { round: sortDir }
      : sortField === "isFeatured"
      ? { isFeatured: sortDir }
      : sortField === "date"
      ? { date: sortDir }
      : {}),
  };

  const totalMatchesCount = await prisma.match.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalMatchesCount / PAGE_RECORDS_COUNT);

  const matches = await prisma.match.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
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
    <>
      <PageHeader label="Matches List" />
      <div className="dashboard-search-and-add">
        <SearchFieldComponent />
        <AddNewLinkComponent
          href="/dashboard/matches/new"
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
              <TableHead className="dashboard-head-table-cell">Score</TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="date"
                  label="Date & Time"
                  labelForSmallerDevices="D&T"
                />
              </TableHead>
              <TableHead className="dashboard-head-table-cell">
                <SortComponent
                  fieldName="group"
                  label="Group"
                  labelForSmallerDevices="Grp"
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
              <TableHead className="dashboard-head-table-cell">
                <SortComponent fieldName="isFeatured" label="Is Featured" />
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
                group,
                round,
                date,
                tournamentEdition,
                isFeatured,
              }) => (
                <TableRow key={id} className="dashboard-table-row">
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">{homeTeam.code}</span>
                    <span className="hidden sm:block">{homeTeam.name}</span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <span className="hidden max-sm:block">{awayTeam.code}</span>
                    <span className="hidden sm:block">{awayTeam.name}</span>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {homeGoals} - {awayGoals}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <div className="flex flex-col">
                      <span className="hidden max-sm:block">
                        {date ? getFormattedDate(date.toString(), true) : ""}
                      </span>
                      <span className="hidden max-sm:block">
                        {date
                          ? getFormattedTime(date.toString(), true, false)
                          : ""}
                      </span>
                      <span className="hidden sm:block">
                        {date ? getFormattedDate(date.toString(), true) : ""}
                      </span>
                      <span className="hidden sm:block">
                        {date
                          ? getFormattedTime(date.toString(), false, false)
                          : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {group.name}
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
                  <TableCell className="dashboard-table-cell">
                    {isFeatured ? <Check /> : <X />}
                  </TableCell>
                  <ActionsCellDropDown editHref={`/dashboard/matches/${id}`} />
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
