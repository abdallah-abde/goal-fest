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

import {
  getFormattedDate,
  getFormattedDateTime,
  getFormattedTime,
} from "@/lib/getFormattedDate";

import PageHeader from "@/components/PageHeader";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import AddNewLinkComponent from "@/components/forms/parts/AddNewLinkComponent";
import SearchFieldComponent from "@/components/table-parts/SearchFieldComponent";
import SortComponent from "@/components/table-parts/SortComponent";
import DashboardTableFooter from "@/components/table-parts/DashboardTableFooter";
import ActionsCellDropDown from "@/components/table-parts/ActionsCellDropDown";

import { Check, X } from "lucide-react";
import FeaturedSwitcher from "@/components/table-parts/FeaturedSwitcher";
import PopoverKnockoutMatchScoreUpdator from "@/components/table-parts/PopoverKnockoutMatchScoreUpdator";
import { Button } from "@/components/ui/button";

export default async function DashboardKnockoutMatchesPage({
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
      : sortField === "round"
      ? { round: sortDir }
      : sortField === "isFeatured"
      ? { isFeatured: sortDir }
      : sortField === "date"
      ? { date: sortDir }
      : {}),
  };

  const totalMatchesCount = await prisma.knockoutMatch.count({
    where: {
      ...where,
    },
  });

  const totalPages = Math.ceil(totalMatchesCount / PAGE_RECORDS_COUNT);

  const matches = await prisma.knockoutMatch.findMany({
    where: { ...where },
    skip: (currentPage - 1) * PAGE_RECORDS_COUNT,
    take: PAGE_RECORDS_COUNT,
    orderBy: { ...orderBy },
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
                homeExtraTimeGoals,
                awayExtraTimeGoals,
                homeTeamPlacehlder,
                awayTeamPlacehlder,
                homePenaltyGoals,
                awayPenaltyGoals,
                date,
                round,
                tournamentEdition,
                isFeatured,
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
                    <PopoverKnockoutMatchScoreUpdator
                      id={id}
                      homeTeamName={
                        homeTeam ? homeTeam.name : homeTeamPlacehlder || ""
                      }
                      awayTeamName={
                        awayTeam ? awayTeam.name : awayTeamPlacehlder || ""
                      }
                      tournamentName={tournamentEdition.tournament.name}
                      editionName={tournamentEdition.year.toString()}
                      roundName={round || ""}
                      date={
                        date
                          ? getFormattedDateTime(date.toString())
                          : "No date information"
                      }
                      homeGoals={homeGoals}
                      awayGoals={awayGoals}
                      homeExtraTimeGoals={homeExtraTimeGoals}
                      awayExtraTimeGoals={awayExtraTimeGoals}
                      homePenaltyGoals={homePenaltyGoals}
                      awayPenaltyGoals={awayPenaltyGoals}
                    >
                      <Button variant="ghost">
                        {homeGoals} - {awayGoals}
                      </Button>
                    </PopoverKnockoutMatchScoreUpdator>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <PopoverKnockoutMatchScoreUpdator
                      id={id}
                      homeTeamName={
                        homeTeam ? homeTeam.name : homeTeamPlacehlder || ""
                      }
                      awayTeamName={
                        awayTeam ? awayTeam.name : awayTeamPlacehlder || ""
                      }
                      tournamentName={tournamentEdition.tournament.name}
                      editionName={tournamentEdition.year.toString()}
                      roundName={round || ""}
                      date={
                        date
                          ? getFormattedDateTime(date.toString())
                          : "No date information"
                      }
                      homeGoals={homeGoals}
                      awayGoals={awayGoals}
                      homeExtraTimeGoals={homeExtraTimeGoals}
                      awayExtraTimeGoals={awayExtraTimeGoals}
                      homePenaltyGoals={homePenaltyGoals}
                      awayPenaltyGoals={awayPenaltyGoals}
                    >
                      <Button variant="ghost">
                        {homeExtraTimeGoals} - {awayExtraTimeGoals}
                      </Button>
                    </PopoverKnockoutMatchScoreUpdator>
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <PopoverKnockoutMatchScoreUpdator
                      id={id}
                      homeTeamName={
                        homeTeam ? homeTeam.name : homeTeamPlacehlder || ""
                      }
                      awayTeamName={
                        awayTeam ? awayTeam.name : awayTeamPlacehlder || ""
                      }
                      tournamentName={tournamentEdition.tournament.name}
                      editionName={tournamentEdition.year.toString()}
                      roundName={round || ""}
                      date={
                        date
                          ? getFormattedDateTime(date.toString())
                          : "No date information"
                      }
                      homeGoals={homeGoals}
                      awayGoals={awayGoals}
                      homeExtraTimeGoals={homeExtraTimeGoals}
                      awayExtraTimeGoals={awayExtraTimeGoals}
                      homePenaltyGoals={homePenaltyGoals}
                      awayPenaltyGoals={awayPenaltyGoals}
                    >
                      <Button variant="ghost">
                        {homePenaltyGoals} - {awayPenaltyGoals}
                      </Button>
                    </PopoverKnockoutMatchScoreUpdator>
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
                    {round}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {tournamentEdition.tournament.name}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    {tournamentEdition.year.toString()}
                  </TableCell>
                  <TableCell className="dashboard-table-cell">
                    <FeaturedSwitcher
                      id={id}
                      type="knockoutMatches"
                      isFeatured={isFeatured}
                    />
                    {/* {isFeatured ? <Check /> : <X />} */}
                  </TableCell>
                  <ActionsCellDropDown
                    editHref={`/dashboard/knockout-matches/${id}`}
                  />
                </TableRow>
              )
            )}
          </TableBody>
          <DashboardTableFooter totalPages={totalPages} colSpan={11} />
        </Table>
      ) : (
        <NoDataFoundComponent message="No Knockout Matches Found" />
      )}
    </>
  );
}
