export function getTeamsGoalsScored(
  tournamentEditionId: number,
  limit?: number | undefined
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of goals scored in regular matches for the specific tournament edition
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id THEN m.homeGoals 
          WHEN m.awayTeamId = t.id THEN m.awayGoals 
          ELSE 0 
      END)
      FROM Match m
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND m.tournamentEditionId = ${tournamentEditionId}
  ), 0) AS groupMatchGoals,

  -- Sum of goals scored in knockout matches (main time + extra time) for the specific tournament edition
  COALESCE((
      SELECT SUM(CASE 
          WHEN km.homeTeamId = t.id THEN (km.homeGoals + COALESCE(km.homeExtraTimeGoals, 0)) 
          WHEN km.awayTeamId = t.id THEN (km.awayGoals + COALESCE(km.awayExtraTimeGoals, 0))
          ELSE 0 
      END)
      FROM KnockoutMatch km
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id)
        AND km.tournamentEditionId = ${tournamentEditionId}
  ), 0) AS knockoutMatchGoals

FROM 
  Team t

WHERE 
  EXISTS (
      SELECT 1 
      FROM Match m 
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
        AND m.tournamentEditionId = ${tournamentEditionId}
  )
  OR EXISTS (
      SELECT 1 
      FROM KnockoutMatch km 
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id) 
        AND km.tournamentEditionId = ${tournamentEditionId}
  )

ORDER BY 
  (groupMatchGoals + knockoutMatchGoals) DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return query;
}

export function getTeamsGoalsAgainst(
  tournamentEditionId: number,
  limit?: number | undefined
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of goals against in regular matches for the specific tournament edition
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id THEN m.awayGoals 
          WHEN m.awayTeamId = t.id THEN m.homeGoals 
          ELSE 0 
      END)
      FROM Match m
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND m.tournamentEditionId = ${tournamentEditionId}
  ), 0) AS groupMatchGoals,

  -- Sum of goals against in knockout matches (main time + extra time) for the specific tournament edition
  COALESCE((
      SELECT SUM(CASE 
          WHEN km.homeTeamId = t.id THEN (km.awayGoals + COALESCE(km.awayExtraTimeGoals, 0)) 
          WHEN km.awayTeamId = t.id THEN (km.homeGoals + COALESCE(km.homeExtraTimeGoals, 0))
          ELSE 0 
      END)
      FROM KnockoutMatch km
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id)
        AND km.tournamentEditionId = ${tournamentEditionId}
  ), 0) AS knockoutMatchGoals

FROM 
  Team t

WHERE 
  EXISTS (
      SELECT 1 
      FROM Match m 
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
        AND m.tournamentEditionId = ${tournamentEditionId}
  )
  OR EXISTS (
      SELECT 1 
      FROM KnockoutMatch km 
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id) 
        AND km.tournamentEditionId = ${tournamentEditionId}
  )

ORDER BY 
  (groupMatchGoals + knockoutMatchGoals) DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return query;
}

export function getTeamsCleanSheets(
  tournamentEditionId: number,
  limit?: number | undefined
) {
  const query = `
SELECT 
  t.id AS teamId,
  t.name AS teamName,
  t.code AS teamCode,
  t.flagUrl AS teamFlagUrl,

  -- Sum of clean sheets in regular matches for the specific tournament edition
  COALESCE((
      SELECT SUM(CASE 
          WHEN m.homeTeamId = t.id AND m.awayGoals = 0 THEN 1 
          WHEN m.awayTeamId = t.id AND m.homeGoals = 0 THEN 1 
          ELSE 0 
      END)
      FROM Match m
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id)
        AND m.tournamentEditionId = ${tournamentEditionId}
  ), 0) AS groupMatchCleanSheets,

  -- Sum of clean sheets in knockout matches (main time + extra time) for the specific tournament edition
  COALESCE((
      SELECT SUM(CASE 
          WHEN km.homeTeamId = t.id AND km.awayExtraTimeGoals is null AND km.awayGoals = 0 THEN 1 
          WHEN km.homeTeamId = t.id AND km.awayExtraTimeGoals = 0 AND km.awayGoals = 0 THEN 1 
          WHEN km.awayTeamId = t.id AND km.homeExtraTimeGoals is null AND km.homeGoals = 0 THEN 1 
          WHEN km.awayTeamId = t.id AND km.homeExtraTimeGoals = 0 AND km.homeGoals = 0 THEN 1 
          ELSE 0 
      END)
      FROM KnockoutMatch km
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id)
        AND km.tournamentEditionId = ${tournamentEditionId}
  ), 0) AS knockoutMatchCleanSheets

FROM 
  Team t

WHERE 
  EXISTS (
      SELECT 1 
      FROM Match m 
      WHERE (m.homeTeamId = t.id OR m.awayTeamId = t.id) 
        AND m.tournamentEditionId = ${tournamentEditionId}
  )
  OR EXISTS (
      SELECT 1 
      FROM KnockoutMatch km 
      WHERE (km.homeTeamId = t.id OR km.awayTeamId = t.id) 
        AND km.tournamentEditionId = ${tournamentEditionId}
  )

ORDER BY 
  (groupMatchCleanSheets + knockoutMatchCleanSheets) DESC

${limit ? `LIMIT ${limit}` : ""}
`;

  return query;
}
