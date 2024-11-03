import prisma from "@/lib/db";

import MatchesCards from "@/components/lists/cards/matches/MatchesCards";
import {
  getAllTournamentMatchesRounds,
  checkTournamentRoundExisted,
} from "@/lib/getAllMatchesRounds";
import { getStartAndEndDates } from "@/lib/getFormattedDate";

export default async function TournamentMatchesPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: {
    teamId: string;
    groupId: string;
    round: string | undefined;
    date: string;
  };
}) {
  const { slug } = params;

  const teamId = searchParams?.teamId || "all";
  const groupId = searchParams?.groupId || "all";
  let round = searchParams?.round || undefined;
  const date = searchParams?.date || "";

  round = await checkTournamentRoundExisted(slug, searchParams?.round);

  const isAllTeams = !teamId || teamId === "all";
  const isAllGroups = !groupId || groupId === "all";

  const { startDate, endDate } = getStartAndEndDates(date);

  const groupMatchConditions: any = {
    ...(groupId && !isAllGroups && { groupId: +groupId }), // Filter by group if specific group selected
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    groupMatchConditions.OR = [
      { homeTeamId: +teamId },
      { awayTeamId: +teamId },
    ];
  }

  const knockoutMatchConditions: any = {
    ...(round && { round }), // Filter by round if provided
    ...(date && { date: { gte: startDate, lte: endDate } }),
  };

  if (!isAllTeams) {
    knockoutMatchConditions.OR = [
      { homeTeamId: +teamId },
      { awayTeamId: +teamId },
    ];
  }

  const [tournamentEdition, matches, knockoutMatches, rounds] =
    await Promise.all([
      prisma.tournamentEdition.findUnique({
        where: { slug },
        include: {
          tournament: true,
          teams: true,
          groups: true,
          hostingCountries: true,
          winner: true,
          titleHolder: true,
        },
      }),
      isAllGroups || groupId
        ? prisma.match.findMany({
            where: {
              tournamentEdition: {
                slug,
              },
              ...groupMatchConditions,
            },
            include: {
              homeTeam: true,
              awayTeam: true,
              tournamentEdition: {
                include: {
                  tournament: true,
                  hostingCountries: true,
                  teams: true,
                  winner: true,
                  titleHolder: true,
                  groups: true,
                },
              },
              group: true,
            },
          })
        : [],
      isAllGroups
        ? prisma.knockoutMatch.findMany({
            where: {
              tournamentEdition: {
                slug,
              },
              ...knockoutMatchConditions,
            },
            include: {
              homeTeam: true,
              awayTeam: true,
              tournamentEdition: {
                include: {
                  tournament: true,
                  hostingCountries: true,
                  teams: true,
                  winner: true,
                  titleHolder: true,
                  groups: true,
                },
              },
            },
          })
        : [],
      getAllTournamentMatchesRounds(slug),
    ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  return (
    <MatchesCards
      editionOrseason={tournamentEdition}
      matches={matches}
      knockoutMatches={knockoutMatches}
      rounds={rounds}
      type="tournaments"
    />
  );
}
