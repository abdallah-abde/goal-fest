"use client";

import Image from "next/image";

import * as _ from "lodash";

import { Team, KnockoutMatch, TournamentEdition } from "@prisma/client";

import {
  Bracket,
  IRoundProps,
  ISeedProps,
  IRenderSeedProps,
  SeedTeam,
  SeedItem,
  Seed,
} from "react-brackets";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";

interface KnockoutMatchProps extends KnockoutMatch {
  tournamentEdition: TournamentEdition;
  homeTeam: Team | null;
  awayTeam: Team | null;
}

export default function KnockoutBrackets({
  matches,
}: {
  matches: KnockoutMatchProps[];
}) {
  const results = Object.entries(_.groupBy(matches, "round"));

  const rounds = results.map(([title, roundMatches]) => {
    return {
      title,
      seeds: roundMatches.map((singleMatch) => {
        return {
          id: singleMatch.id,
          date: singleMatch.date
            ? getFormattedDate(singleMatch.date.toString())
            : "",
          time: singleMatch.date
            ? getFormattedTime(singleMatch.date.toString())
            : "",
          teams: [
            {
              name: singleMatch.homeTeam
                ? singleMatch.homeTeam.name
                : singleMatch.homeTeamPlacehlder || "",
              goals: singleMatch.homeGoals,
              extraGoals: singleMatch.homeExtraTimeGoals,
              penaltyGoals: singleMatch.homePenaltyGoals,
              flagUrl: singleMatch.homeTeam && singleMatch.homeTeam.flagUrl,
            },
            {
              name: singleMatch.awayTeam
                ? singleMatch.awayTeam.name
                : singleMatch.awayTeamPlacehlder || "",
              goals: singleMatch.awayGoals,
              extraGoals: singleMatch.awayExtraTimeGoals,
              penaltyGoals: singleMatch.awayPenaltyGoals,
              flagUrl: singleMatch.awayTeam && singleMatch.awayTeam.flagUrl,
            },
          ],
        };
      }),
    };
  });

  return (
    <div>
      <h2 className='text-center pb-4 font-bold'>Knockout Phase</h2>
      <Bracket
        rounds={rounds}
        renderSeedComponent={SeedComponent}
        bracketClassName='w-full'
        roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
          return (
            <div className='text-[14px] text-center font-bold text-primary'>
              {title}
            </div>
          );
        }}
      />
    </div>
  );
}

const SeedComponent = ({ seed }: IRenderSeedProps) => {
  return (
    <Seed style={{ width: "250px" }}>
      <p className='pt-[2px] text-xs'>
        {seed.time ? seed.time : "No Time Provided"}
      </p>
      <SeedItem style={{ backgroundColor: "#64748b" }}>
        {addSeedTeam(seed.teams[0])}
        {addSeedTeam(seed.teams[1])}
      </SeedItem>
      <p className='pt-[2px] text-xs'>
        {seed.date ? seed.date : "No Date Provided"}
      </p>
    </Seed>
  );
};

const addSeedTeam = (team: { [key: string]: any; name?: string }) => {
  return (
    <SeedTeam>
      <div className='flex gap-2 items-center justify-center'>
        {team.flagUrl && (
          <Image
            src={team.flagUrl}
            width={20}
            height={20}
            alt={`${team.name} flag`}
          />
        )}
        <p className='text-xs'>{team.name}</p>
      </div>
      <div className='flex items-center justify-center gap-2'>
        {(team.goals || team.goals === 0) && (
          <p className='text-xs'>{`${team.goals}`}</p>
        )}
        {(team.extraGoals || team.extraGoals === 0) && (
          <p className='text-xs'>{`Ex(${team.extraGoals + team.goals})`}</p>
        )}
        {(team.penaltyGoals || team.penaltyGoals === 0) && (
          <p className='text-xs'>{`P(${team.penaltyGoals})`}</p>
        )}
      </div>
    </SeedTeam>
  );
};
