"use client";

import { KnockoutMatch } from "@/typings";
import { FC } from "react";
import {
  Bracket,
  IRoundProps,
  ISeedProps,
  IRenderSeedProps,
  SeedTeam,
  SeedItem,
  Seed,
} from "react-brackets";
import { Badge } from "./ui/badge";
import Image from "next/image";
import * as _ from "lodash";

interface Props {
  matches: KnockoutMatch[];
}

const KnockoutBrackets: FC<Props> = ({ matches }) => {
  const results = Object.entries(_.groupBy(matches, "round"));

  const rounds: IRoundProps[] = results.map<IRoundProps>(([title, seeds]) => {
    return {
      title,
      seeds: seeds.map<ISeedProps>(
        ({
          id,
          homeTeam,
          homeGoals,
          homeExtraTimeGoals,
          homePenaltyGoals,
          homeTeamPlacehlder,
          awayTeam,
          awayGoals,
          awayExtraTimeGoals,
          awayPenaltyGoals,
          awayTeamPlacehlder,
          date,
        }) => {
          return {
            id,
            teams: [
              {
                name: homeTeam ? homeTeam.name : homeTeamPlacehlder,
                flagUrl: homeTeam?.flagUrl,
                goals: homeGoals,
                extraGoals: homeExtraTimeGoals,
                penaltyGoals: homePenaltyGoals,
              },
              {
                name: awayTeam ? awayTeam.name : awayTeamPlacehlder,
                flagUrl: awayTeam?.flagUrl,
                goals: awayGoals,
                extraGoals: awayExtraTimeGoals,
                penaltyGoals: awayPenaltyGoals,
              },
            ],
            date: date ? date.toDateString() : "",
          };
        }
      ),
    };
  });

  return (
    <div>
      <h2 className='text-center pb-4 font-bold'>Knockout Phase</h2>
      <Bracket rounds={rounds} renderSeedComponent={SeedComponent} />
    </div>
  );
};

const SeedComponent = ({ seed }: IRenderSeedProps) => {
  return (
    <Seed>
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
            src={`/teams/${team.flagUrl}`}
            width={20}
            height={20}
            alt={`${team.name} flag`}
          />
        )}
        <p className='text-xs'>{team.name}</p>
      </div>
      <div className='flex items-center justify-center gap-2'>
        {team.goals && <p className='text-xs'>{`(${team.goals})`}</p>}
        {team.extraGoals && (
          <p className='text-xs'>{`Ex(${team.extraGoals + team.goals})`}</p>
        )}
        {team.penaltyGoals && (
          <p className='text-xs'>{`P(${team.penaltyGoals})`}</p>
        )}
      </div>
    </SeedTeam>
  );
};

export default KnockoutBrackets;
