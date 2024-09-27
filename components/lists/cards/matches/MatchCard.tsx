"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { NeutralMatch } from "@/types";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import { Team } from "@prisma/client";

export default function MatchCard({ match }: { match: NeutralMatch }) {
  return (
    <Card key={match.id} className='rounded-lg bg-primary/10'>
      <CardContent className='grid grid-cols-5 grid-rows-3 gap-2 pt-6'>
        {/* Group information */}
        {match.group && (
          <div className='row-start-1 col-start-1 col-end-3 self-center'>
            <Badge variant='secondary' className='hover:bg-secondary'>
              {match.group.name}
            </Badge>
          </div>
        )}

        {/* Round information */}
        <div
          className={`row-start-1 col-start-${
            match.group ? "4" : "1"
          } col-end-${match.group ? "6" : "3"} self-center place-self-${
            match.group ? "end" : "start"
          }`}
        >
          <Badge
            variant={match.round ? "secondary" : "destructive"}
            className='hover:bg-secondary'
          >
            {match.round ? `${match.round}` : "No round info"}
          </Badge>
        </div>

        {/* Home Team information */}
        <TeamLabel
          team={match.homeTeam || null}
          placeholder={match.homeTeamPlaceholder || ""}
          isHome={true}
        />

        {/* Score information */}
        <ScoreLabel
          homeGoals={match.homeGoals}
          awayGoals={match.awayGoals}
          homeExtraTimeGoals={match.homeExtraTimeGoals}
          awayExtraTimeGoals={match.awayExtraTimeGoals}
          homePenaltyGoals={match.homePenaltyGoals}
          awayPenaltyGoals={match.awayPenaltyGoals}
        />

        {/* Away Team information */}
        <TeamLabel
          team={match.awayTeam || null}
          placeholder={match.awayTeamPlaceholder || ""}
          isHome={false}
        />

        {/* Date information */}
        <div className='row-start-3 col-start-1 col-end-3 self-center'>
          <p>{match.date?.toString() || "No Date"}</p>
          <p>{match.localDate}</p>
          <p>{match.localDateOnlyDate}</p>
          <p>{match.localTime}</p>
          <Badge
            variant={match.date ? "default" : "destructive"}
            className='hidden sm:inline-block hover:bg-primary'
          >
            {match.localDate
              ? getFormattedDate(match.localDate)
              : "No date info"}
          </Badge>
          <Badge
            variant={match.date ? "default" : "destructive"}
            className='hidden max-sm:inline-block hover:bg-primary'
          >
            {match.localTime || "No time info"}
          </Badge>
        </div>

        {/* Time information */}
        <div className='row-start-3 col-start-4 col-end-6 self-center place-self-end'>
          <Badge
            variant={match.date ? "default" : "destructive"}
            className='hidden sm:inline-block hover:bg-primary'
          >
            {match.date
              ? getFormattedTime(match.date.toString())
              : "No time info"}
          </Badge>
          <Badge
            variant={match.date ? "default" : "destructive"}
            className='hidden max-sm:inline-block hover:bg-primary'
          >
            {match.date
              ? getFormattedTime(match.date.toString(), true)
              : "No time info"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamLabel({
  team,
  placeholder,
  isHome,
}: {
  team: Team | null;
  placeholder: string;
  isHome: boolean;
}) {
  return (
    <div
      className={`row-start-2 ${
        isHome
          ? "col-start-1 col-end-3 place-self-end"
          : "col-start-4 col-end-6 place-self-start"
      } self-center flex flex-col-reverse ${
        isHome ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-3 max-sm:gap-2 max-sm:mx-6`}
    >
      <p className='hidden sm:inline-block text-[16px] sm:text-[18px] font-bold'>
        {team ? team?.name : placeholder}
      </p>
      <p className='hidden max-sm:inline-block text-[16px] font-bold'>
        {!team ? placeholder : team.code ? team.code : team.name}
      </p>
      {team && team.flagUrl && (
        <Image
          src={team?.flagUrl}
          width={25}
          height={25}
          alt={`${team?.name} Flag`}
          className='w-7 h-7 m-0'
        />
      )}
    </div>
  );
}

function ScoreLabel({
  homeGoals,
  awayGoals,
  homeExtraTimeGoals,
  awayExtraTimeGoals,
  homePenaltyGoals,
  awayPenaltyGoals,
}: {
  homeGoals: number | null | undefined;
  awayGoals: number | null | undefined;
  homeExtraTimeGoals: number | null | undefined;
  awayExtraTimeGoals: number | null | undefined;
  homePenaltyGoals: number | null | undefined;
  awayPenaltyGoals: number | null | undefined;
}) {
  return (
    <div className='row-start-1 row-end-4 col-start-3 col-end-4 place-self-center flex flex-col items-center justify-center gap-2'>
      {homeGoals !== null && awayGoals !== null && (
        <div className='text-[18px] xs:text-[22px] font-bold flex gap-2'>
          {homeGoals !== null && <span className='ml-auto'>{homeGoals}</span>}
          <span className='text-center'>-</span>
          {awayGoals !== null && <span className='mr-auto'>{awayGoals}</span>}
        </div>
      )}
      {homeExtraTimeGoals !== null && awayExtraTimeGoals !== null && (
        <div className='text-[10px] xs:text-[14px] font-bold flex flex-col items-center justify-center'>
          <span>Extra time:</span>
          <div className='flex gap-2'>
            {homeExtraTimeGoals !== null && (
              <span className='ml-auto'>{homeExtraTimeGoals}</span>
            )}
            <span className='text-center'>-</span>
            {awayExtraTimeGoals !== null && (
              <span className='mr-auto'>{awayExtraTimeGoals}</span>
            )}
          </div>
        </div>
      )}
      {homePenaltyGoals !== null && awayPenaltyGoals !== null && (
        <div className='text-[10px] xs:text-[14px] font-bold flex flex-col items-center justify-center'>
          <span>Penalties:</span>
          <div className='flex gap-2'>
            {homePenaltyGoals !== null && (
              <span className='ml-auto'>{homePenaltyGoals}</span>
            )}
            <span className='text-center'>-</span>
            {awayPenaltyGoals !== null && (
              <span className='mr-auto'>{awayPenaltyGoals}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
