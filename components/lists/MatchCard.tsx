"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { NeutralMatch } from "@/typings";

import { getFormattedDate, getFormattedTime } from "@/lib/getFormattedDate";
import { Team } from "@prisma/client";
import { useMediaQuery } from "react-responsive";

export default function MatchCard({
  match,
  isSmall,
}: {
  match: NeutralMatch;
  isSmall: boolean;
}) {
  return (
    <Card key={match.id} className='rounded-lg bg-primary/10'>
      <CardContent className='grid grid-cols-5 grid-rows-3 gap-2 pt-6'>
        {match.group && (
          <div className='row-start-1 col-start-1 col-end-3 self-center'>
            <Badge variant='secondary' className='hover:bg-secondary'>
              {match.group.name}
            </Badge>
          </div>
        )}
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
        <TeamLabel
          team={match.homeTeam || null}
          placeholder={match.homeTeamPlacehlder || ""}
          isHome={true}
        />
        {/* <div className='row-start-2 col-start-1 col-end-3 place-self-end self-center flex flex-col md:flex-row items-center gap-3  max-xs:gap-2'>
          <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
            {match.homeTeam ? match.homeTeam?.name : match.homeTeamPlacehlder}
          </p>
          <p className='hidden max-xs:block text-[16px] font-bold'>
            {!match.homeTeam
              ? match.homeTeamPlacehlder
              : match.homeTeam.code
              ? match.homeTeam.code
              : match.homeTeam.name}
          </p>
          {match.homeTeam && match.homeTeam.flagUrl && (
            <Image
              src={match.homeTeam?.flagUrl}
              width={25}
              height={25}
              alt={`${match.homeTeam?.name} Flag`}
            />
          )}
        </div> */}
        <div className='row-start-1 row-end-4 col-start-3 col-end-4 place-self-center flex flex-col items-center justify-center gap-2'>
          {match.homeGoals !== null && match.awayGoals !== null && (
            <div className='text-[18px] xs:text-[22px] font-bold flex gap-2'>
              {match.homeGoals !== null && (
                <span className='ml-auto'>{match.homeGoals}</span>
              )}
              <span className='text-center'>-</span>
              {match.awayGoals !== null && (
                <span className='mr-auto'>{match.awayGoals}</span>
              )}
            </div>
          )}
          {match.homeExtraTimeGoals !== null &&
            match.awayExtraTimeGoals !== null && (
              <div className='text-[10px] xs:text-[14px] font-bold flex flex-col items-center justify-center'>
                <span>Extra time:</span>
                <div className='flex gap-2'>
                  {match.homeExtraTimeGoals !== null && (
                    <span className='ml-auto'>{match.homeExtraTimeGoals}</span>
                  )}
                  <span className='text-center'>-</span>
                  {match.awayExtraTimeGoals !== null && (
                    <span className='mr-auto'>{match.awayExtraTimeGoals}</span>
                  )}
                </div>
              </div>
            )}
          {match.homePenaltyGoals !== null &&
            match.awayPenaltyGoals !== null && (
              <div className='text-[10px] xs:text-[14px] font-bold flex flex-col items-center justify-center'>
                <span>Penalties:</span>
                <div className='flex gap-2'>
                  {match.homePenaltyGoals !== null && (
                    <span className='ml-auto'>{match.homePenaltyGoals}</span>
                  )}
                  <span className='text-center'>-</span>
                  {match.awayPenaltyGoals !== null && (
                    <span className='mr-auto'>{match.awayPenaltyGoals}</span>
                  )}
                </div>
              </div>
            )}
        </div>
        <TeamLabel
          team={match.awayTeam || null}
          placeholder={match.awayTeamPlacehlder || ""}
          isHome={false}
        />
        {/* <div className='row-start-2 col-start-4 col-end-6 place-self-start self-center flex flex-col-reverse md:flex-row items-center gap-3 max-xs:gap-2'>
          {match.awayTeam && match.awayTeam.flagUrl && (
            <Image
              src={match.awayTeam?.flagUrl}
              width={25}
              height={25}
              alt={`${match.awayTeam?.name} Flag`}
            />
          )}
          <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
            {match.awayTeam ? match.awayTeam?.name : match.awayTeamPlacehlder}
          </p>
          <p className='hidden max-xs:block text-[16px] font-bold'>
            {!match.awayTeam
              ? match.awayTeamPlacehlder
              : match.awayTeam.code
              ? match.awayTeam.code
              : match.awayTeam.name}
          </p>
        </div> */}
        <div className='row-start-3 col-start-1 col-end-3 self-center'>
          <Badge
            variant={match.date ? "default" : "destructive"}
            className='hover:bg-primary'
          >
            {match.date
              ? getFormattedDate(match.date.toString(), !isSmall)
              : "No date info"}
          </Badge>
        </div>
        <div className='row-start-3 col-start-4 col-end-6 self-center place-self-end'>
          <Badge
            variant={match.date ? "default" : "destructive"}
            className='hover:bg-primary'
          >
            {match.date
              ? getFormattedTime(match.date.toString(), !isSmall)
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
      className={`row-start-2 col-start-${isHome ? "1" : "4"} col-end-${
        isHome ? "3" : "6"
      } place-self-${
        isHome ? "end" : "start"
      } self-center flex flex-col-reverse ${
        isHome ? "md:flex-row" : "md:flex-row-reverse"
      } items-center gap-3 max-xs:gap-2 max-xs:mx-6`}
    >
      <p className='hidden xs:block text-[16px] xs:text-[18px] font-bold'>
        {team ? team?.name : placeholder}
      </p>
      <p className='hidden max-xs:block text-[16px] font-bold'>
        {!team ? placeholder : team.code ? team.code : team.name}
      </p>
      {team && team.flagUrl && (
        <Image
          src={team?.flagUrl}
          width={25}
          height={25}
          alt={`${team?.name} Flag`}
          className='w-7 h-7'
        />
      )}
    </div>
  );
}
