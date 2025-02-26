import PageHeader from "@/components/PageHeader";
import MatchCard from "@/components/lists/cards/matches/MatchCard";
import prisma from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowBigLeftDash,
  ArrowBigRightDash,
  RectangleVertical,
  CirclePlus,
} from "lucide-react";
import {
  Booking,
  Goal,
  Lineup,
  MatchStat,
  Player,
  Referee,
  Stadium,
  Substitution,
  Team,
} from "@prisma/client";
import * as _ from "lodash";
import { IoFootball, IoShirtOutline } from "react-icons/io5";
import { GiWhistle, GiSoccerField } from "react-icons/gi";
import { MdOutlineDoubleArrow } from "react-icons/md";

interface LineupProps extends Lineup {
  player: Player;
}

interface SubstitutionProps extends Substitution {
  playerIn: Player;
  playerOut: Player;
  team: Team;
}

interface GoalProps extends Goal {
  player: Player;
  team: Team;
}

interface BookingProps extends Booking {
  player: Player;
  team: Team;
}

export default async function MatchPage({
  params,
}: {
  params: { slug: string; match_slug: string };
}) {
  const { slug, match_slug } = params;

  const [season, match] = await Promise.all([
    prisma.season.findUnique({
      where: { slug },
      include: {
        league: {
          include: {
            country: true,
          },
        },
        teams: true,
        groups: true,
        winner: true,
        titleHolder: true,
      },
    }),
    prisma.match.findUnique({
      where: { id: +match_slug },
      include: {
        lineups: {
          include: {
            player: true,
          },
        },
        bookings: {
          include: {
            player: true,
            team: true,
          },
        },
        matchStats: true,
        referee: true,
        stadium: true,
        substitutions: {
          include: {
            playerIn: true,
            playerOut: true,
            team: true,
          },
        },
        goals: {
          include: {
            player: true,
            team: true,
          },
        },
        group: true,
        homeTeam: true,
        awayTeam: true,
        season: {
          include: {
            league: {
              include: {
                country: true,
              },
            },
            teams: true,
            groups: true,
            titleHolder: true,
            winner: true,
          },
        },
      },
    }),
  ]);

  if (!season || !match) throw new Error("Something went wrong");

  return (
    <>
      <PageHeader
        label={`${season.league.name} (${season.year}) | ${match.homeTeam?.name} vs ${match.awayTeam?.name}`}
      />
      <div className="flex flex-col gap-8">
        <div className="w-full">
          <div className="w-full space-y-4">
            <MatchCard key={match.id} match={match} />

            <div className="space-y-4">
              {/* Line up */}

              <_LineUp
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                homeTeamFormation={match.homeFormation}
                awayTeamFormation={match.awayFormation}
                lineups={match.lineups}
                bookings={match.bookings}
                substitutions={match.substitutions}
              />

              {/* Stats */}

              <_Stats
                matchStats={match.matchStats}
                bookings={match.bookings}
                homeTeamId={match.homeTeamId}
                awayTeamId={match.awayTeamId}
              />

              {/* Match info */}

              <_MatchInfo
                referee={match.referee}
                stadium={match.stadium}
                attendance={match.attendance}
              />

              {/* Match Events */}

              <_MatchEvents
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                bookings={match.bookings}
                substitutions={match.substitutions}
                goals={match.goals}
              />

              <div>Match Events</div>
              <div>Current Position</div>
              <div>Head to Head</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function _SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center mb-4">
      <Badge variant="gold" className="text-[16px]">
        {title}
      </Badge>
      <Separator className="bg-yellow-200 w-[25%] h-1 rounded-md -translate-x-2" />
    </div>
  );
}

function _SectionSubTitle({ title }: { title: string }) {
  return <p className="bg-secondary/20 p-2 pl-4 rounded-md">{title}</p>;
}

function _PlayerImage() {
  return (
    <Avatar className=" hover:bg-primary w-8 h-8">
      <AvatarImage src="#" alt="#" />
      <AvatarFallback className="bg-primary border-none text-primary-foreground">
        <IoShirtOutline />
      </AvatarFallback>
    </Avatar>
  );
}

function _FormationLinePlayers({
  title,
  lineups,
  bookings,
  substitutions,
}: {
  title: string;
  lineups: LineupProps[];
  bookings: Booking[];
  substitutions: SubstitutionProps[];
}) {
  if (lineups.length === 0) return <></>;

  return (
    <>
      <_SectionSubTitle title={title} />
      <div className="flex justify-around pb-3">
        {lineups.map(({ id, playerId, goals, player: { name, position } }) => {
          const yellowCards = bookings.filter(
            (a) => a.playerId === playerId && a.cardType === "yellow"
          ).length;

          const redCards = bookings.filter(
            (a) => a.playerId === playerId && a.cardType === "red"
          ).length;

          const isPlayerOut =
            substitutions.filter((a) => a.playerOutId === playerId).length > 0;

          return (
            <div key={id} className="flex gap-1 items-center justify-center">
              <div className="relative">
                <_PlayerImage />

                {yellowCards === 1 && redCards === 0 && (
                  <RectangleVertical
                    size="16"
                    className="absolute -top-2 -right-1 z-10 text-yellow-500 fill-yellow-500 rounded-md -skew-x-12"
                  />
                )}

                {redCards === 1 && (
                  <RectangleVertical
                    size="16"
                    className="absolute -top-2 -right-1 z-20 text-destructive fill-destructive rounded-md -skew-x-12"
                  />
                )}

                {isPlayerOut && (
                  <ArrowBigLeftDash
                    className="absolute -bottom-3 -left-2 z-10 text-destructive fill-destructive -rotate-45"
                    size="16"
                  />
                )}

                {goals > 0 && (
                  <IoFootball className="w-[14px] h-[14px] absolute -bottom-3 -right-2 z-50 flex gap-1 items-center p-0 border-0" />
                )}
              </div>
              <div className="flex gap-[1px] flex-col p-2 py-1">
                <p>{name}</p>
                <p className="text-[10px] text-primary/70">{position}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function _NoneFormationLinePlayers({
  title,
  lineups,
  bookings,
  substitutions,
}: {
  title: string;
  lineups: LineupProps[];
  bookings: Booking[];
  substitutions: SubstitutionProps[];
}) {
  if (lineups.length === 0) return <></>;

  return (
    <>
      <_SectionSubTitle title={title} />
      <div className="px-4 space-y-4">
        {lineups.map(
          ({
            id,
            playerId,
            player: { name, position },
            isBench,
            isCoach,
            isMissing,
            goals,
          }) => {
            const playerIn = substitutions.find(
              (a) => a.playerInId === playerId
            );

            const yellowCards = bookings.filter(
              (a) => a.playerId === playerId && a.cardType === "yellow"
            ).length;

            const redCards = bookings.filter(
              (a) => a.playerId === playerId && a.cardType === "red"
            ).length;

            return (
              <div
                key={id}
                className="flex items-center justify-between  border-b-2 last:border-b-0 pb-3"
              >
                <div className="flex gap-4 items-center justify-start">
                  <_PlayerImage />
                  <div className="flex flex-col">
                    <p className={`${playerIn ? "text-green-500" : ""}`}>
                      {name}
                    </p>
                    <p className="text-[11px] text-primary/55 font-semibold">
                      {position}
                    </p>
                  </div>
                  {isBench && (
                    <>
                      {playerIn && playerIn.playerOut && (
                        <>
                          <div className="pl-4 flex flex-col items-center">
                            <MdOutlineDoubleArrow className="w-5 h-5 text-green-500" />
                            <MdOutlineDoubleArrow className="w-5 h-5 text-destructive -translate-x-2 rotate-180" />
                          </div>
                          <p className="text-destructive text-xs self-end">
                            {playerIn.playerOut.name}
                          </p>
                        </>
                      )}
                    </>
                  )}
                </div>
                {(isBench || isCoach) && (
                  <div className="flex gap-2">
                    {yellowCards === 1 && redCards === 0 && (
                      <RectangleVertical
                        size="26"
                        className="text-yellow-500 fill-yellow-500 rounded-md "
                      />
                    )}
                    {redCards === 1 && (
                      <RectangleVertical
                        size="26"
                        className=" text-destructive fill-destructive rounded-md "
                      />
                    )}
                    {goals > 0 && (
                      <Badge variant="outline" className="border-0">
                        <IoFootball className="w-7 h-7" />
                        {goals > 1 && (
                          <span className="text-sm pl-2">x {goals}</span>
                        )}
                      </Badge>
                    )}
                  </div>
                )}
                {isMissing && (
                  <CirclePlus
                    size="26"
                    className="text-destructive rounded-md "
                  />
                )}
              </div>
            );
          }
        )}
      </div>
    </>
  );
}

function _LineUp({
  lineups,
  homeTeam,
  awayTeam,
  homeTeamFormation,
  awayTeamFormation,
  bookings,
  substitutions,
}: {
  lineups: LineupProps[];
  homeTeam: Team | null;
  awayTeam: Team | null;
  homeTeamFormation: string | null;
  awayTeamFormation: string | null;
  bookings: Booking[];
  substitutions: SubstitutionProps[];
}) {
  return (
    <div className="bg-primary/10 p-6 rounded-md">
      <_SectionTitle title="Line-Up" />
      {homeTeam && awayTeam && (
        <Tabs defaultValue={homeTeam?.id?.toString()}>
          <TabsList className="w-full">
            <TabsTrigger value={homeTeam.id.toString()} className="w-full">
              {homeTeam.name}
              <span className="text-xs ml-1">({homeTeamFormation})</span>
            </TabsTrigger>
            <TabsTrigger value={awayTeam.id.toString()} className="w-full">
              {awayTeam.name}
              <span className="text-xs ml-1">({awayTeamFormation})</span>
            </TabsTrigger>
          </TabsList>
          {[homeTeam, awayTeam].map((team, idx) => {
            const teamId = team.id;

            const fieldPlayers = Object.entries(
              _.groupBy(
                lineups
                  .sort((a, b) =>
                    a.category !== b.category
                      ? a.category < b.category
                        ? -1
                        : 1
                      : 0
                  )
                  .filter(
                    (p) =>
                      p.teamId === teamId &&
                      p.isStarting &&
                      !p.isCoach &&
                      !p.isBench &&
                      !p.isMissing
                  ),
                "category"
              )
            );

            const coaches = lineups.filter(
              (a) => a.isCoach && a.teamId === teamId
            );

            const benchPlayers = lineups.filter(
              (a) => a.isBench && a.teamId === teamId
            );

            const missingPlayers = lineups.filter(
              (a) => a.isMissing && a.teamId === teamId
            );

            const cards = bookings.filter((a) => a.teamId === teamId);

            const substitutedPlayers = substitutions.filter(
              (a) => a.teamId === teamId
            );

            return (
              <TabsContent
                key={idx}
                value={teamId.toString()}
                className="p-3 m-2 rounded-md space-y-8"
              >
                <div className="space-y-4">
                  {fieldPlayers.map(([category, lineups], idx) => (
                    <_FormationLinePlayers
                      key={idx}
                      title={category.split("_")[1]}
                      lineups={lineups}
                      bookings={cards}
                      substitutions={substitutedPlayers}
                    />
                  ))}
                </div>

                {/* Coach */}

                <div className="space-y-4">
                  <_NoneFormationLinePlayers
                    title="Coach"
                    lineups={coaches}
                    bookings={cards}
                    substitutions={substitutedPlayers}
                  />
                </div>

                {/* Bench Players */}

                <div className="space-y-4">
                  <_NoneFormationLinePlayers
                    title="Bench"
                    lineups={benchPlayers}
                    bookings={cards}
                    substitutions={substitutedPlayers}
                  />
                </div>

                {/* Missing Players */}

                <div className="space-y-4">
                  <_NoneFormationLinePlayers
                    title="Missing"
                    lineups={missingPlayers}
                    bookings={cards}
                    substitutions={substitutedPlayers}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

function _Stats({
  matchStats,
  bookings,
  homeTeamId,
  awayTeamId,
}: {
  matchStats: MatchStat[];
  bookings: Booking[];
  homeTeamId: number | null;
  awayTeamId: number | null;
}) {
  if (homeTeamId === null || awayTeamId === null) return <></>;

  const homeTeamYellowBookingsCount = bookings.filter(
    (a) => a.teamId === homeTeamId && a.cardType === "yellow"
  ).length;
  const awayTeamYellowBookingsCount = bookings.filter(
    (a) => a.teamId === awayTeamId && a.cardType === "yellow"
  ).length;
  const homeTeamRedBookingsCount = bookings.filter(
    (a) => a.teamId === homeTeamId && a.cardType === "red"
  ).length;
  const awayTeamRedBookingsCount = bookings.filter(
    (a) => a.teamId === awayTeamId && a.cardType === "red"
  ).length;

  const statsByCategory = Object.entries(_.groupBy(matchStats, "category"));

  return (
    <div className="bg-primary/10 p-6 rounded-md">
      <_SectionTitle title="Stats" />
      <div className="space-y-4">
        <>
          {statsByCategory.map(([category, stats]) => (
            <div key={category} className="space-y-4">
              <_SectionSubTitle title={category} />
              <div className="px-4">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="flex items-center justify-between  border-b-2 last:border-b-0 py-3 first:pt-0"
                  >
                    <span>
                      <Badge>{`${stat.homeTeamStat} ${
                        stat.title === "Possession" ? "%" : ""
                      }`}</Badge>
                    </span>
                    <span className="text-center">{stat.title}</span>
                    <span className="text-right">
                      <Badge>{`${stat.awayTeamStat} ${
                        stat.title === "Possession" ? "%" : ""
                      }`}</Badge>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-4">
            <_SectionSubTitle title="Booking" />
            <div className="px-4">
              <div className="flex items-center justify-between  border-b-2 last:border-b-0 py-3 first:pt-0">
                <span>
                  <Badge>{homeTeamRedBookingsCount}</Badge>
                </span>
                <span className="text-center">Red Cards</span>
                <span className="text-right">
                  <Badge>{awayTeamRedBookingsCount}</Badge>
                </span>
              </div>
              <div className="flex items-center justify-between  border-b-2 last:border-b-0 py-3 first:pt-0">
                <span>
                  <Badge>{homeTeamYellowBookingsCount}</Badge>
                </span>
                <span className="text-center">Yellow Cards</span>
                <span className="text-right">
                  <Badge>{awayTeamYellowBookingsCount}</Badge>
                </span>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

function _MatchInfo({
  referee,
  stadium,
  attendance,
}: {
  referee: Referee | null;
  stadium: Stadium | null;
  attendance: number | null;
}) {
  return (
    <div className="bg-primary/10 p-6 rounded-md">
      <_SectionTitle title="Match Info" />
      <div className="space-y-4">
        {referee && (
          <div className="space-y-4">
            <_SectionSubTitle title="Referee" />
            <div className="px-4 flex gap-2 justify-start items-center py-1">
              <GiWhistle className="w-7 h-7" />
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <p>{referee.name}</p>
                  <Badge className="text-[11px] font-semibold hover:bg-primary">
                    {referee.nationality}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        {stadium && (
          <div className="space-y-4">
            <_SectionSubTitle title="Stadium" />
            <div className="px-4 flex gap-2 justify-start items-start">
              <GiSoccerField className="w-7 h-7" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <p>{stadium.name}</p>
                  <Badge className="text-[11px] font-semibold hover:bg-primary">
                    {stadium.city}
                  </Badge>
                  <Badge className="text-[11px] font-semibold hover:bg-primary">
                    {stadium.country}
                  </Badge>
                </div>
                {attendance && (
                  <>
                    <p className="text-[11px] text-primary/55 font-semibold">
                      Attendance: {attendance}
                    </p>
                    <p className="text-[11px] text-primary/55 font-semibold">
                      Capacity: {stadium.capacity}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function _MatchEvents({
  homeTeam,
  awayTeam,
  bookings,
  substitutions,
  goals,
}: {
  homeTeam: Team | null;
  awayTeam: Team | null;
  bookings: BookingProps[];
  substitutions: SubstitutionProps[];
  goals: GoalProps[];
}) {
  const results: {
    id: number;
    matchId: number;
    teamId: number;
    teamName: string;
    playerId: number;
    playerName: string;
    playerInId?: number | null;
    playerInName?: string | null;
    minute: string;
    type: string;
  }[] = bookings
    .map((a) => {
      return {
        id: a.id,
        matchId: a.matchId,
        playerId: a.playerId,
        playerName: a.player.name,
        teamId: a.teamId,
        teamName: a.team.name,
        minute: `${a.minute} ${a.extraMinute ? "+" + a.extraMinute : ""}`,
        type: `${a.cardType === "yellow" ? "yellowCard" : "redCard"}`,
      };
    })
    .concat(
      goals.map((a) => {
        return {
          id: a.id,
          matchId: a.matchId,
          playerId: a.playerId,
          playerName: a.player.name,
          teamId: a.teamId,
          teamName: a.team.name,
          minute: `${a.minute} ${a.extraMinute ? "+" + a.extraMinute : ""}`,
          type: `${a.isOwn ? "ownGoal" : "goal"}`,
        };
      }),
      substitutions.map((a) => {
        return {
          id: a.id,
          matchId: a.matchId,
          playerId: a.playerOutId,
          playerName: a.playerOut.name,
          playerInId: a.playerInId,
          playerInName: a.playerIn.name,
          teamId: a.teamId,
          teamName: a.team.name,
          minute: `${a.minute} ${a.extraMinute ? "+" + a.extraMinute : ""}`,
          type: "substitution",
        };
      })
    )
    .sort((a, b) =>
      a.minute !== b.minute ? (a.minute < b.minute ? -1 : 1) : 0
    );

  return (
    <div className="bg-primary/10 p-6 rounded-md">
      <_SectionTitle title="Match Events" />

      <div className="space-y-4">
        {results.map((a) => {
          const home = a.teamId === homeTeam?.id;

          return (
            <div
              key={`${a.id}_${a.type}`}
              className="flex items-center justify-between px-4 w-full"
            >
              <div
                className={`flex flex-${
                  home ? "row" : "row-reverse"
                } items-center justify-between w-[50%] ${
                  !home ? "ml-auto" : ""
                }`}
              >
                <div
                  className={`flex flex-${
                    home ? "row" : "row-reverse"
                  } gap-4 items-center justify-${home ? "start" : "end"}`}
                >
                  <_PlayerImage />
                  {a.playerInId && <_PlayerImage />}
                  <div className="flex flex-col">
                    <p className={`${a.playerInId ? "text-green-500" : ""}`}>
                      {a.playerInName}
                    </p>
                    {a.playerInId && (
                      <p className="text-destructive">{a.playerName}</p>
                    )}
                    {!a.playerInId && (
                      <>
                        <p>{a.playerName}</p>
                        <p className="text-[11px] text-primary/55 font-semibold">
                          Position
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className={`flex flex-${
                    home ? "row" : "row-reverse"
                  } items-center justify-between gap-8`}
                >
                  <_IconByType type={a.type} />
                  <span className="text-sm">{a.minute}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function _IconByType({ type }: { type: string }) {
  switch (type) {
    case "yellowCard":
      return (
        <RectangleVertical
          size="26"
          className="text-yellow-500 fill-yellow-500 rounded-md"
        />
      );
    case "redCard":
      return (
        <RectangleVertical
          size="26"
          className="text-destructive fill-destructive rounded-md"
        />
      );
    case "goal":
      return <IoFootball className="w-[26px] h-[26px]" />;

    case "ownGoal":
      return <IoFootball className="w-[26px] h-[26px] text-destructive" />;

    case "substitution":
      return (
        <div className="pl-4 flex flex-col items-center">
          <MdOutlineDoubleArrow className="w-5 h-5 text-green-500" />
          <MdOutlineDoubleArrow className="w-5 h-5 text-destructive -translate-x-2 rotate-180" />
        </div>
      );
    default:
      return <></>;
  }
}
