import prisma from "@/lib/db";
import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import { Prisma } from "@prisma/client";

export async function getTeamsGoalsScored(
  slug: string,
  limit?: number | undefined,
  type?: "tournaments" | "leagues"
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of goals scored in regular matches for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id THEN m.homeGoals 
          WHEN m.awayTeamId = t.id THEN m.awayGoals 
          ELSE 0 
      END)
      FROM ${type === "tournaments" ? "Match" : "LeagueMatch"} m
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON m.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS groupMatchesGoals,

  -- Sum of goals scored in knockout matches (main time + extra time) for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN km.homeTeamId = t.id THEN (km.homeGoals + COALESCE(km.homeExtraTimeGoals, 0)) 
          WHEN km.awayTeamId = t.id THEN (km.awayGoals + COALESCE(km.awayExtraTimeGoals, 0))
          ELSE 0 
      END)
      FROM ${
        type === "tournaments" ? "KnockoutMatch" : "LeagueKnockoutMatch"
      } km
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON km.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS knockoutMatchesGoals

FROM 
  ${type === "tournaments" ? "Team" : "LeagueTeam"} t

WHERE 
  EXISTS (
      SELECT 1 
      FROM ${type === "tournaments" ? "Match" : "LeagueMatch"} m 
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON m.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
         AND te.slug = "${slug}"
  )
  OR EXISTS (
      SELECT 1 
      FROM ${
        type === "tournaments" ? "KnockoutMatch" : "LeagueKnockoutMatch"
      } km 
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON km.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id) 
        AND te.slug = "${slug}"
  )

ORDER BY 
  (groupMatchesGoals + knockoutMatchesGoals) DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(query)}`;
}

// export function getLeagueTeamsGoalsScored(
//   slug: string,
//   limit?: number | undefined
// ) {
//   const query = `
// SELECT
//   t.id AS teamId,
//   t.name AS teamName,
//   t.code AS teamCode,
//   t.flagUrl AS teamFlagUrl,

//   -- Sum of goals scored in regular league matches for the specific league season
//   COALESCE((
//       SELECT SUM(CASE
//           WHEN m.homeTeamId = t.id THEN m.homeGoals
//           WHEN m.awayTeamId = t.id THEN m.awayGoals
//           ELSE 0
//       END)
//       FROM LeagueMatch m
//        INNER JOIN LeagueSeason te ON m.seasonId = te.id
//        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
//         AND te.slug = "${slug}"
//   ), 0) AS matchesGoals

// FROM LeagueTeam t

// WHERE
//   EXISTS (
//       SELECT 1
//       FROM LeagueMatch m
//        INNER JOIN LeagueSeason te ON m.seasonId = te.id
//        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
//         AND te.slug = "${slug}"
//   )

// ORDER BY matchesGoals DESC

// ${limit ? `LIMIT ${limit}` : ""}
// `;

//   return query;
// }

export async function getTeamsGoalsAgainst(
  slug: string,
  limit?: number | undefined,
  type?: "tournaments" | "leagues"
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of goals against in regular matches for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id THEN m.awayGoals 
          WHEN m.awayTeamId = t.id THEN m.homeGoals 
          ELSE 0 
      END)
      FROM ${type === "tournaments" ? "Match" : "LeagueMatch"} m
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON m.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS groupMatchesGoals,

  -- Sum of goals against in knockout matches (main time + extra time) for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN km.homeTeamId = t.id THEN (km.awayGoals + COALESCE(km.awayExtraTimeGoals, 0)) 
          WHEN km.awayTeamId = t.id THEN (km.homeGoals + COALESCE(km.homeExtraTimeGoals, 0))
          ELSE 0 
      END)
      FROM ${
        type === "tournaments" ? "KnockoutMatch" : "LeagueKnockoutMatch"
      } km
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON km.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS knockoutMatchesGoals

FROM 
  ${type === "tournaments" ? "Team" : "LeagueTeam"} t

WHERE 
  EXISTS (
      SELECT 1 
      FROM ${type === "tournaments" ? "Match" : "LeagueMatch"} m 
       INNER JOIN ${
         type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
       } te ON m.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
         AND te.slug = "${slug}"
  )
  OR EXISTS (
      SELECT 1 
      FROM ${
        type === "tournaments" ? "KnockoutMatch" : "LeagueKnockoutMatch"
      } km 
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON km.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id) 
        AND te.slug = "${slug}"
  )

ORDER BY 
  (groupMatchesGoals + knockoutMatchesGoals) DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(query)}`;
}

// export function getLeagueTeamsGoalsAgainst(
//   slug: string,
//   limit?: number | undefined
// ) {
//   const query = `
//     SELECT
//       t.id AS teamId,
//       t.name AS teamName,
//       t.code AS teamCode,
//       t.flagUrl AS teamFlagUrl,

//       -- Sum of goals against in regular league matches for the specific league season
//       COALESCE((
//           SELECT SUM(CASE
//               WHEN m.homeTeamId = t.id THEN m.awayGoals
//               WHEN m.awayTeamId = t.id THEN m.homeGoals
//               ELSE 0
//           END)
//           FROM LeagueMatch m
//            INNER JOIN LeagueSeason te ON m.seasonId = te.id
//            WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
//             AND te.slug = "${slug}"
//       ), 0) AS matchesGoals

//     FROM LeagueTeam t

//     WHERE
//       EXISTS (
//           SELECT 1
//           FROM LeagueMatch m
//            INNER JOIN LeagueSeason te ON m.seasonId = te.id
//            WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
//              AND te.slug = "${slug}"
//       )
//     ORDER BY matchesGoals DESC

//     ${limit ? `LIMIT ${limit}` : ""}
//     `;

//   return query;
// }

export async function getTeamsCleanSheets(
  slug: string,
  limit?: number | undefined,
  type?: "tournaments" | "leagues"
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of clean sheets in regular matches for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id AND m.awayGoals = 0 THEN 1 
          WHEN m.awayTeamId = t.id AND m.homeGoals = 0 THEN 1 
          ELSE 0 
      END)
      FROM ${type === "tournaments" ? "Match" : "LeagueMatch"} m
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON m.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS groupMatchesCleanSheets,

  -- Sum of clean sheets in knockout matches (main time + extra time) for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN km.homeTeamId = t.id AND km.awayExtraTimeGoals is null AND km.awayGoals = 0 THEN 1 
          WHEN km.homeTeamId = t.id AND km.awayExtraTimeGoals = 0 AND km.awayGoals = 0 THEN 1 
          WHEN km.awayTeamId = t.id AND km.homeExtraTimeGoals is null AND km.homeGoals = 0 THEN 1 
          WHEN km.awayTeamId = t.id AND km.homeExtraTimeGoals = 0 AND km.homeGoals = 0 THEN 1 
          ELSE 0 
      END)
      FROM ${
        type === "tournaments" ? "KnockoutMatch" : "LeagueKnockoutMatch"
      } km
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON km.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS knockoutMatchesCleanSheets

FROM 
   ${type === "tournaments" ? "Team" : "LeagueTeam"} t

WHERE 
  EXISTS (
      SELECT 1 
      FROM ${type === "tournaments" ? "Match" : "LeagueMatch"} m 
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON m.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
         AND te.slug = "${slug}"
  )
  OR EXISTS (
      SELECT 1 
      FROM ${
        type === "tournaments" ? "KnockoutMatch" : "LeagueKnockoutMatch"
      } km 
      INNER JOIN ${
        type === "tournaments" ? "TournamentEdition" : "LeagueSeason"
      } te ON km.${
    type === "tournaments" ? "tournamentEditionId" : "seasonId"
  } = te.id
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id) 
        AND te.slug = "${slug}"
  )

ORDER BY 
  (groupMatchesCleanSheets + knockoutMatchesCleanSheets) DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return await prisma.$queryRaw<TotalCleanSheetsProps[]>`${Prisma.raw(query)}`;
}

// export function getLeagueTeamsCleanSheets(
//   slug: string,
//   limit?: number | undefined
// ) {
//   const query = `
// SELECT
//   t.id AS teamId,
//   t.name AS teamName,
//   t.code AS teamCode,
//   t.flagUrl AS teamFlagUrl,

//   -- Sum of clean sheets in regular league matches for the specific league season
//   COALESCE((
//       SELECT SUM(CASE
//           WHEN m.homeTeamId = t.id AND m.awayGoals = 0 THEN 1
//           WHEN m.awayTeamId = t.id AND m.homeGoals = 0 THEN 1
//           ELSE 0
//       END)
//       FROM LeagueMatch m
//        INNER JOIN LeagueSeason te ON m.seasonId = te.id
//        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
//         AND te.slug = "${slug}"
//   ), 0) AS matchesCleanSheets

// FROM  LeagueTeam t

// WHERE
//   EXISTS (
//       SELECT 1
//       FROM LeagueMatch m
//        INNER JOIN LeagueSeason te ON m.seasonId = te.id
//        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
//         AND te.slug = "${slug}"
//   )

// ORDER BY matchesCleanSheets DESC

// ${limit ? `LIMIT ${limit}` : ""}
// `;

//   return query;
// }
