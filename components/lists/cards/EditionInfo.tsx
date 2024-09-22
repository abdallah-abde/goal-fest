"use client";

import * as React from "react";
import Image from "next/image";

import { TournamentEdition, Team, Tournament, Country } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NoDataFoundComponent from "@/components/NoDataFoundComponent";
import TotalGoalsCard from "@/components/lists/cards/TotalGoalsCard";
import { TotalCleanSheetsProps, TotalGoalsProps } from "@/types/totalStats";
import TotalCleanSheetsCard from "./TotalCleanSheetsCards";

interface TournamentEditionProps extends TournamentEdition {
  teams: Team[];
  tournament: Tournament;
  winner: Team | null;
  titleHolder: Team | null;
  hostingCountries: Country[];
}

export default function EditionInfo({
  tournamentEdition,
  teamsGoalsScored,
  teamsGoalsAgainst,
  teamsCleanSheets,
}: {
  tournamentEdition: TournamentEditionProps | null;
  teamsGoalsScored: TotalGoalsProps[];
  teamsGoalsAgainst: TotalGoalsProps[];
  teamsCleanSheets: TotalCleanSheetsProps[];
}) {
  return (
    <>
      {tournamentEdition ? (
        <div className='space-y-8'>
          <InfoCards tournamentEdition={tournamentEdition} />
          {tournamentEdition?.hostingCountries &&
            tournamentEdition?.hostingCountries.length > 0 && (
              <HostingCountriesComponent
                hostingCountries={tournamentEdition?.hostingCountries}
              />
            )}
          {(teamsGoalsScored.length > 0 ||
            teamsGoalsAgainst.length > 0 ||
            teamsCleanSheets.length > 0) && (
            <div className='flex flex-wrap gap-2 justify-between'>
              {teamsGoalsScored && (
                <TotalGoalsCard
                  label='Most goals scored'
                  teamsGoals={teamsGoalsScored}
                />
              )}
              {teamsGoalsAgainst && (
                <TotalGoalsCard
                  label='Most goals conceded'
                  teamsGoals={teamsGoalsAgainst}
                />
              )}
              {teamsCleanSheets && (
                <TotalCleanSheetsCard
                  label='Most clean sheets'
                  teamsCleanSheets={teamsCleanSheets}
                />
              )}
            </div>
          )}
          {tournamentEdition?.teams && tournamentEdition?.teams.length > 0 && (
            <TeamsComponent teams={tournamentEdition.teams} />
          )}
        </div>
      ) : (
        <NoDataFoundComponent message='Sorry, No Info Found' />
      )}
    </>
  );
}

function InfoCards({
  tournamentEdition,
}: {
  tournamentEdition: TournamentEditionProps | null;
}) {
  const cardStyles =
    "flex-1 min-w-40 bg-primary/10 text-primary text-center flex flex-col justify-between";

  const cardTitlestyles = "text-lg";
  const badgeStyles =
    "text-sm font-bold border-2 w-full flex items-center justify-between gap-2";

  return (
    <div className='flex flex-wrap gap-2 justify-between'>
      {tournamentEdition &&
        tournamentEdition.teams &&
        tournamentEdition.teams.length > 0 && (
          <Card className={cardStyles}>
            <CardHeader>
              <CardTitle className={cardTitlestyles}>Number of Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className='text-xl hover:bg-primary'>
                {tournamentEdition?.teams.length}
              </Badge>
            </CardContent>
          </Card>
        )}
      {tournamentEdition && tournamentEdition?.currentStage && (
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={cardTitlestyles}>Current Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant='green'
              className={badgeStyles + " justify-center py-1"}
            >
              <span>{tournamentEdition.currentStage}</span>
            </Badge>
          </CardContent>
        </Card>
      )}
      {tournamentEdition && tournamentEdition?.titleHolder && (
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={cardTitlestyles}>Title Holder</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant='destructive'
              className={badgeStyles + " hover:bg-destructive"}
            >
              <>
                <span>{tournamentEdition?.titleHolder?.name}</span>
                {tournamentEdition?.titleHolder?.flagUrl && (
                  <Image
                    src={tournamentEdition?.titleHolder?.flagUrl}
                    alt={tournamentEdition.titleHolder.name + " Flag"}
                    width={25}
                    height={25}
                  />
                )}
              </>
            </Badge>
          </CardContent>
        </Card>
      )}
      {tournamentEdition && tournamentEdition?.winner && (
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={cardTitlestyles}>Winner</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant='gold' className={badgeStyles}>
              <>
                <span>{tournamentEdition?.winner?.name}</span>
                {tournamentEdition?.winner?.flagUrl && (
                  <Image
                    src={tournamentEdition?.winner?.flagUrl}
                    alt={tournamentEdition.winner.name + " Flag"}
                    width={25}
                    height={25}
                  />
                )}
              </>
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HostingCountriesComponent({
  hostingCountries,
}: {
  hostingCountries: Country[];
}) {
  return (
    <div className=''>
      <h2 className='font-bold mb-2'>Hosting Countries</h2>
      <div className='flex flex-wrap gap-2 justify-between'>
        {hostingCountries.map(({ id, name, flagUrl }) => (
          <Card
            key={id}
            className='2xs:min-w-56 bg-primary/10 text-primary flex flex-col justify-between'
          >
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='w-full text-xl flex items-center justify-center'>
                {name}
                {flagUrl && (
                  <Image
                    width={30}
                    height={30}
                    src={flagUrl}
                    alt={name + " Flag"}
                    className='ml-4'
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm flex justify-between'>
              <div className='flex flex-col items-center gap-1'>
                <Badge className='flex items-center border-primary font-bold hover:bg-primary'>
                  5{/* TODO: Bring Cities */}
                </Badge>
                <span className='font-semibold'>Cities</span>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <Badge className='flex items-center border-primary font-bold hover:bg-primary'>
                  10
                  {/* TODO: Bring Stadiums */}
                </Badge>
                <span className='font-semibold'>Stadiums</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TeamsComponent({ teams }: { teams: Team[] }) {
  return (
    <div className=''>
      <h2 className='font-bold mb-2'>Teams</h2>
      <div className='flex flex-wrap gap-2 justify-between'>
        {teams.map(({ id, name, flagUrl }) => (
          <Card
            key={id}
            className='flex-1 min-w-40 bg-primary/10 text-primary flex flex-col-reverse justify-between items-center'
          >
            <CardHeader className='flex flex-row items-center justify-center'>
              <CardTitle className=''>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className='text-lg font-bold text-center truncate w-[10ch]'>
                        {name}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-6 pb-0'>
              {flagUrl && (
                <Image
                  width={40}
                  height={40}
                  src={flagUrl}
                  alt={name + " Flag"}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
