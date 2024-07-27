"use client";

import * as React from "react";
import Image from "next/image";

import { TournamentEdition, Team, Tournament, Country } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import NoDataFound from "./NoDataFound";
import { Badge } from "./ui/badge";

interface TournamentEditionProps extends TournamentEdition {
  teams: Team[];
  tournament: Tournament;
  winner: Team | null;
  hostingCountries: Country[];
}

const TournamentEditionHomeComponent = ({
  tournamentEdition,
}: {
  tournamentEdition: TournamentEditionProps | null;
}) => {
  return (
    <div className='space-y-8'>
      <InfoCards tournamentEdition={tournamentEdition} />
      {tournamentEdition?.hostingCountries &&
        tournamentEdition?.hostingCountries.length > 0 && (
          <HostingCountriesComponent
            hostingCountries={tournamentEdition?.hostingCountries}
          />
        )}
      {tournamentEdition?.teams && tournamentEdition?.teams.length > 0 && (
        <TeamsComponent teams={tournamentEdition.teams} />
      )}
    </div>
  );
};

export default TournamentEditionHomeComponent;

function HostingCountriesComponent({
  hostingCountries,
}: {
  hostingCountries: Country[];
}) {
  return (
    <div className=''>
      <h2 className='font-bold mb-2'>Hosting Countries</h2>
      <div className='flex flex-wrap gap-2 justify-between'>
        {hostingCountries.map((country) => (
          <Card className='2xs:min-w-56 bg-primary/10 text-primary flex flex-col justify-between'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='w-full text-xl flex items-center justify-center'>
                {country.name}
                {country.flagUrl && (
                  <Image
                    width={30}
                    height={30}
                    src={country.flagUrl}
                    alt={country.name + " Flag"}
                    className='ml-4'
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className='text-sm flex justify-between'>
              <div className='flex flex-col items-center gap-1'>
                <Badge className='flex items-center border-primary font-bold hover:bg-primary'>
                  5
                </Badge>
                <span className='font-semibold'>Cities</span>
              </div>
              <div className='flex flex-col items-center gap-1'>
                <Badge className='flex items-center border-primary font-bold hover:bg-primary'>
                  10
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
      <Card className={cardStyles}>
        <CardHeader>
          <CardTitle className={cardTitlestyles}>Current Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant='green'
            className={badgeStyles + " justify-center py-1"}
          >
            <span>Groups</span>
          </Badge>
        </CardContent>
      </Card>
      <Card className={cardStyles}>
        <CardHeader>
          <CardTitle className={cardTitlestyles}>Title Holder</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant='destructive'
            className={badgeStyles + " hover:bg-destructive"}
          >
            {tournamentEdition && tournamentEdition?.winner && (
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
            )}
          </Badge>
        </CardContent>
      </Card>
      <Card className={cardStyles}>
        <CardHeader>
          <CardTitle className={cardTitlestyles}>Winner</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant='gold' className={badgeStyles}>
            {tournamentEdition && tournamentEdition?.winner && (
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
            )}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamsComponent({ teams }: { teams: Team[] }) {
  return (
    <div className=''>
      <h2 className='font-bold mb-2'>Teams</h2>
      <div className='flex flex-wrap gap-2 justify-between'>
        {teams.map((team) => (
          <Card className='flex-1 min-w-40 bg-primary/10 text-primary flex flex-col-reverse justify-between items-center'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg font-bold'>{team.name}</CardTitle>
            </CardHeader>
            <CardContent className='pt-6 pb-0'>
              {team.flagUrl && (
                <Image
                  width={40}
                  height={40}
                  src={team.flagUrl}
                  alt={team.name + " Flag"}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
