import prisma from "@/lib/db";
import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import { Prisma } from "@prisma/client";

export async function getTeamsGoalsScored(
  slug: string,
  limit?: number | undefined
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of goals scored in group matches (non-knockout matches)
  COALESCE((
      SELECT SUM(
          CASE 
              WHEN m.homeTeamId = t.id THEN m.homeGoals
              WHEN m.awayTeamId = t.id THEN m.awayGoals
              ELSE 0
          END
      )
      FROM Match m
      INNER JOIN Season te ON m.seasonId = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND te.slug = "${slug}"
        AND m.isKnockout = false
  ), 0) AS groupMatchesGoals,

  -- Sum of goals scored in knockout matches (including extra-time goals)
  COALESCE((
      SELECT SUM(
          CASE 
              WHEN m.homeTeamId = t.id THEN 
                  m.homeGoals + COALESCE(m.homeExtraTimeGoals, 0)
              WHEN m.awayTeamId = t.id THEN 
                  m.awayGoals + COALESCE(m.awayExtraTimeGoals, 0)
              ELSE 0
          END
      )
      FROM Match m
      INNER JOIN Season te ON m.seasonId = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND te.slug = "${slug}"
        AND m.isKnockout = true
  ), 0) AS knockoutMatchesGoals

FROM Team t

WHERE 
  EXISTS (
      SELECT 1 
      FROM Match m 
      INNER JOIN Season te ON m.seasonId = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
        AND te.slug = "${slug}"
  )

ORDER BY 
  groupMatchesGoals DESC, 
  knockoutMatchesGoals DESC

${limit ? `LIMIT ${limit}` : ""};
`;

  return await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(query)}`;
}

export async function getTeamsGoalsAgainst(
  slug: string,
  limit?: number | undefined
) {
  const query = `
  SELECT 
    t.id AS teamId,
    t.name AS teamName,
    t.code AS teamCode,
    t.flagUrl AS teamFlagUrl,
  
    -- Sum of goals against in group matches (non-knockout matches)
    COALESCE((
        SELECT SUM(
            CASE 
                WHEN m.homeTeamId = t.id THEN m.awayGoals
                WHEN m.awayTeamId = t.id THEN m.homeGoals
                ELSE 0
            END
        )
        FROM Match m
        INNER JOIN Season te ON m.seasonId = te.id
        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
          AND te.slug = "${slug}"
          AND m.isKnockout = false
    ), 0) AS groupMatchesGoals,
  
    -- Sum of goals against in knockout matches (including extra-time goals)
    COALESCE((
        SELECT SUM(
            CASE 
                WHEN m.homeTeamId = t.id THEN 
                    m.homeGoals + COALESCE(m.awayExtraTimeGoals, 0)
                WHEN m.awayTeamId = t.id THEN 
                    m.awayGoals + COALESCE(m.homeExtraTimeGoals, 0)
                ELSE 0
            END
        )
        FROM Match m
        INNER JOIN Season te ON m.seasonId = te.id
        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
          AND te.slug = "${slug}"
          AND m.isKnockout = true
    ), 0) AS knockoutMatchesGoals
  
  FROM Team t
  
  WHERE 
    EXISTS (
        SELECT 1 
        FROM Match m 
        INNER JOIN Season te ON m.seasonId = te.id
        WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
          AND te.slug = "${slug}"
    )
  
  ORDER BY 
    groupMatchesGoals DESC, 
    knockoutMatchesGoals DESC
  
  ${limit ? `LIMIT ${limit}` : ""};
  `;

  return await prisma.$queryRaw<TotalGoalsProps[]>`${Prisma.raw(query)}`;
}

export async function getTeamsCleanSheets(
  slug: string,
  limit?: number | undefined
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of clean sheets in knockout matches (main time + extra time) for the specific tournament edition or league season
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id AND m.awayExtraTimeGoals is null AND m.awayGoals = 0 THEN 1 
          WHEN m.homeTeamId = t.id AND m.awayExtraTimeGoals = 0 AND m.awayGoals = 0 THEN 1 
          WHEN m.awayTeamId = t.id AND m.homeExtraTimeGoals is null AND m.homeGoals = 0 THEN 1 
          WHEN m.awayTeamId = t.id AND m.homeExtraTimeGoals = 0 AND m.homeGoals = 0 THEN 1 
          ELSE 0 
      END)
      FROM Match m
      INNER JOIN Season te ON m.seasonId = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND te.slug = "${slug}"
  ), 0) AS matchesCleanSheets

FROM Team t

WHERE 
  EXISTS (
      SELECT 1 
      FROM Match m 
      INNER JOIN Season te ON m.seasonId = te.id
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
         AND te.slug = "${slug}"
  )

ORDER BY 
  matchesCleanSheets DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return await prisma.$queryRaw<TotalCleanSheetsProps[]>`${Prisma.raw(query)}`;
}
