// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useFormState } from "react-dom";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   LeagueMatch,
//   LeagueTeam,
//   League,
//   LeagueSeason,
//   LeagueGroup,
//   Country,
// } from "@prisma/client";

// import { addLeagueMatch, updateLeagueMatch } from "@/actions/leagueMatches";

// import PageHeader from "@/components/PageHeader";
// import SubmitButton from "@/components/forms/parts/SubmitButton";
// import FormField from "@/components/forms/parts/FormField";
// import FormFieldError from "@/components/forms/parts/FormFieldError";
// import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

// import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";

// import { Ban, Check } from "lucide-react";

// interface LeagueMatchProps extends LeagueMatch {
//   season: LeagueSeasonProps;
//   group: LeagueGroup | null;
//   homeTeam: LeagueTeam;
//   awayTeam: LeagueTeam;
// }

// interface LeagueSeasonProps extends LeagueSeason {
//   league: League;
// }

// interface LeagueTeamProps extends LeagueTeam {
//   country: Country | null;
// }

// export default function LeagueMatchForm({
//   leagueMatch,
//   leagues,
// }: {
//   leagueMatch?: LeagueMatchProps | null;
//   leagues: League[];
// }) {
//   const formRef = useRef<HTMLFormElement>(null);

//   const [formState, formAction] = useFormState(
//     leagueMatch == null
//       ? addLeagueMatch
//       : updateLeagueMatch.bind(null, leagueMatch.id),
//     { errors: undefined, success: false, customError: null }
//   );

//   useEffect(() => {
//     if (formState.success) {
//       formRef.current?.reset();
//       if (leagueMatch == null) {
//         setHomeTeamId(undefined);
//         setHomeTeamKey(+new Date());

//         setAwayTeamId(undefined);
//         setAwayTeamKey(+new Date());
//       }
//     }
//   }, [formState]);

//   const [leagueId, setLeagueId] = useState<string | null>(
//     leagueMatch?.season.leagueId.toString() ||
//       (leagues && leagues.length > 0 && leagues[0].id.toString()) ||
//       null
//   );

//   const [isSeasonsLoading, setIsSeasonsLoading] = useState(false);

//   const [seasons, setSeasons] = useState<LeagueSeasonProps[] | null>(null);

//   const [seasonId, setSeasonId] = useState<string | null>(
//     leagueMatch?.seasonId.toString() ||
//       (seasons && seasons.length > 0 && seasons[0].id.toString()) ||
//       null
//   );

//   const [groups, setGroups] = useState<LeagueGroup[] | null>(null);

//   const [isGroupsLoading, setIsGroupsLoading] = useState(false);

//   const [groupId, setGroupId] = useState<string | null>(
//     leagueMatch?.groupId?.toString() ||
//       (groups && groups.length > 0 && groups[0].id.toString()) ||
//       null
//   );

//   const [seasonTeams, setSeasonTeams] = useState<LeagueTeamProps[] | null>(
//     null
//   );

//   const [isTeamsLoading, setIsTeamsLoading] = useState(false);

//   const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

//   const [homeTeamId, setHomeTeamId] = useState<number | undefined>(
//     leagueMatch?.homeTeamId || undefined
//     // leagueMatch?.homeTeamId?.toString() ||
//     //   (seasonTeams && seasonTeams.length > 0 && seasonTeams[0].id.toString()) ||
//     //   null
//   );

//   const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

//   const [awayTeamId, setAwayTeamId] = useState<number | undefined>(
//     leagueMatch?.awayTeamId || undefined
//     // leagueMatch?.awayTeamId?.toString() ||
//     //   (seasonTeams && seasonTeams.length > 0 && seasonTeams[0].id.toString()) ||
//     //   null
//   );

//   useEffect(() => {
//     async function getSeasons() {
//       setIsSeasonsLoading(true);

//       if (leagueId) {
//         const res = await fetch("/api/leagues-seasons/" + leagueId);
//         const data: LeagueSeasonProps[] = await res.json();

//         setSeasons(data);
//         if (data.length > 0 && !leagueMatch) setSeasonId(data[0].id.toString());
//         else setSeasonId(null);
//       }
//       setIsSeasonsLoading(false);
//     }

//     getSeasons();
//   }, [leagueId]);

//   useEffect(() => {
//     async function getGroups() {
//       setIsGroupsLoading(true);

//       if (seasonId) {
//         const res = await fetch("/api/league-groups/" + seasonId);
//         const data: LeagueGroup[] = await res.json();

//         setGroups(data);
//         if (data.length > 0 && !leagueMatch) setGroupId(data[0].id.toString());
//         else setGroupId(null);
//       }
//       setIsGroupsLoading(false);
//     }

//     getGroups();
//   }, [seasonId]);

//   useEffect(() => {
//     async function getTeams() {
//       setIsTeamsLoading(true);

//       if (seasonId) {
//         const res = await fetch("/api/seasons-teams/" + seasonId);
//         const data = await res.json();

//         setSeasonTeams(data.teams);

//         if (data.length > 0 && !leagueMatch) {
//           setHomeTeamId(data[0].id.toString());
//           setAwayTeamId(data[0].id.toString());
//         } else if (data.length > 0 && leagueMatch) {
//           setHomeTeamId(leagueMatch?.homeTeamId);
//           setAwayTeamId(leagueMatch?.awayTeamId);
//         } else {
//           setHomeTeamId(undefined);
//           setAwayTeamId(undefined);
//         }
//       } else {
//         setSeasonTeams([]);
//       }
//       setIsTeamsLoading(false);
//     }

//     getTeams();
//   }, [seasonId]);

//   useEffect(() => {
//     async function getGroupTeams() {
//       setIsTeamsLoading(true);

//       if (groupId) {
//         const res = await fetch("/api/league-groups-teams/" + groupId);
//         const data = await res.json();

//         setSeasonTeams(data.teams);

//         if (data.length > 0 && !leagueMatch) {
//           setHomeTeamId(data[0].id.toString());
//           setAwayTeamId(data[0].id.toString());
//         } else if (data.length > 0 && leagueMatch) {
//           setHomeTeamId(leagueMatch?.homeTeamId);
//           setAwayTeamId(leagueMatch?.awayTeamId);
//         } else {
//           setHomeTeamId(undefined);
//           setAwayTeamId(undefined);
//         }
//       } else {
//         setSeasonTeams([]);
//       }
//       setIsTeamsLoading(false);
//     }

//     getGroupTeams();
//   }, [groupId]);

//   return (
//     <div className="overflow-auto px-4">
//       <PageHeader
//         label={leagueMatch ? "Edit League Match" : "Add League Match"}
//       />
//       {formState.success && (
//         <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
//           <Check size={20} />
//           Match has been {leagueMatch == null ? "added" : "updated"}{" "}
//           successfully
//         </p>
//       )}
//       {formState.customError && (
//         <p className="p-2 px-3 rounded-md w-full bg-destructive/10 text-destructive text-lg mb-2 text-center flex items-center gap-2">
//           <Ban size={20} />
//           {formState.customError}
//         </p>
//       )}
//       <form action={formAction} className="form-styles" ref={formRef}>
//         {leagues && leagues.length > 0 ? (
//           <FormField>
//             <Label htmlFor="leagueId">League</Label>
//             <Select
//               name="leagueId"
//               defaultValue={
//                 leagueMatch?.season.leagueId.toString() ||
//                 leagueId ||
//                 leagues[0].id.toString() ||
//                 undefined
//               }
//               onValueChange={(value) => setLeagueId(value)}
//             >
//               <SelectTrigger className="flex-1">
//                 <SelectValue placeholder="Choose League" />
//               </SelectTrigger>
//               <SelectContent>
//                 {leagues.map(({ id, name }) => (
//                   <SelectItem value={id.toString()} key={id}>
//                     {name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </FormField>
//         ) : (
//           <FormFieldLoadingState
//             isLoading={false}
//             label=""
//             notFoundText="There is no leagues, add some!"
//           />
//         )}
//         {seasons && seasons.length > 0 && !isSeasonsLoading ? (
//           <FormField>
//             <Label htmlFor="seasonId">League Season</Label>
//             <Select
//               name="seasonId"
//               defaultValue={
//                 leagueMatch?.seasonId.toString() ||
//                 seasonId ||
//                 seasons[0].id.toString() ||
//                 undefined
//               }
//               onValueChange={(value) => setSeasonId(value)}
//             >
//               <SelectTrigger className="flex-1">
//                 <SelectValue placeholder="Choose League Season" />
//               </SelectTrigger>
//               <SelectContent>
//                 {seasons.map(({ id, league, year }) => (
//                   <SelectItem value={id.toString()} key={id}>
//                     {`${league.name} ${year}`}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormFieldError error={formState.errors?.seasonId} />
//           </FormField>
//         ) : (
//           <FormFieldLoadingState
//             isLoading={isSeasonsLoading}
//             label="Loading Seasons..."
//             notFoundText="There is no seasons, add some!"
//           />
//         )}
//         {groups && groups.length > 0 && !isGroupsLoading ? (
//           <FormField>
//             <Label htmlFor="groupId">Group</Label>
//             <Select
//               name="groupId"
//               defaultValue={
//                 leagueMatch?.groupId?.toString() ||
//                 groupId ||
//                 groups[0].id.toString() ||
//                 undefined
//               }
//               onValueChange={(value) => setGroupId(value)}
//             >
//               <SelectTrigger className="flex-1">
//                 <SelectValue placeholder="Choose Group" />
//               </SelectTrigger>
//               <SelectContent>
//                 {groups.map(({ id, name }) => (
//                   <SelectItem value={id.toString()} key={id}>
//                     {name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormFieldError error={formState.errors?.groupId} />
//           </FormField>
//         ) : (
//           <FormFieldLoadingState
//             isLoading={isGroupsLoading}
//             label="Loading Groups..."
//             notFoundText="There is no groups, add some!"
//           />
//         )}
//         <FormField>
//           <div className="flex items-baseline gap-4 mt-2">
//             <Label htmlFor="date">Date</Label>
//             <span className="text-xs text-gray-500 font-semibold">
//               Enter date-time in your local time
//             </span>
//           </div>
//           <Input
//             type="datetime-local"
//             id="date"
//             name="date"
//             defaultValue={
//               leagueMatch?.date
//                 ? getDateValueForDateTimeInput(leagueMatch?.date)
//                 : undefined
//             }
//           />
//           <FormFieldError error={formState.errors?.date} />
//         </FormField>

//         {seasonTeams && seasonTeams.length > 0 && !isTeamsLoading ? (
//           <FormField>
//             <Label htmlFor="homeTeamId">Home Team</Label>
//             <Select
//               name="homeTeamId"
//               key={homeTeamKey}
//               defaultValue={
//                 // (homeTeamId && homeTeamId.toString()) || undefined
//                 leagueMatch?.homeTeamId?.toString() ||
//                 homeTeamId?.toString() ||
//                 seasonTeams[0].id.toString() ||
//                 undefined
//               }
//             >
//               <SelectTrigger className="flex-1">
//                 <SelectValue placeholder="Choose Home Team" />
//               </SelectTrigger>
//               <SelectContent>
//                 {seasonTeams.map(({ id, name, country }) => (
//                   <SelectItem value={id.toString()} key={id}>
//                     {name}{" "}
//                     {country ? (
//                       <Badge
//                         variant="secondary"
//                         className="text-muted-foreground text-xs ml-2"
//                       >
//                         {`${country.name}`}
//                       </Badge>
//                     ) : (
//                       ""
//                     )}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormFieldError error={formState.errors?.homeTeamId} />
//           </FormField>
//         ) : (
//           <FormFieldLoadingState
//             isLoading={isTeamsLoading}
//             label="Loading Teams..."
//             notFoundText="There is no teams, add some!"
//           />
//         )}

//         {seasonTeams && seasonTeams.length > 0 && !isTeamsLoading ? (
//           <FormField>
//             <Label htmlFor="awayTeamId">Away Team</Label>
//             <Select
//               name="awayTeamId"
//               key={awayTeamKey}
//               defaultValue={
//                 // (awayTeamId && awayTeamId.toString()) || undefined
//                 leagueMatch?.awayTeamId?.toString() ||
//                 awayTeamId?.toString() ||
//                 seasonTeams[0].id.toString() ||
//                 undefined
//               }
//             >
//               <SelectTrigger className="flex-1">
//                 <SelectValue placeholder="Choose Away Team" />
//               </SelectTrigger>
//               <SelectContent>
//                 {seasonTeams.map(({ id, name, country }) => (
//                   <SelectItem value={id.toString()} key={id}>
//                     {name}{" "}
//                     {country ? (
//                       <Badge
//                         variant="secondary"
//                         className="text-muted-foreground text-xs ml-2"
//                       >
//                         {`${country.name}`}
//                       </Badge>
//                     ) : (
//                       ""
//                     )}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <FormFieldError error={formState.errors?.awayTeamId} />
//           </FormField>
//         ) : (
//           <FormFieldLoadingState
//             isLoading={isTeamsLoading}
//             label="Loading Teams..."
//             notFoundText="There is no teams, add some!"
//           />
//         )}

//         <FormField>
//           <Label htmlFor="homeGoals">Home Goals</Label>
//           <Input
//             type="text"
//             id="homeGoals"
//             name="homeGoals"
//             defaultValue={
//               leagueMatch?.homeGoals !== null
//                 ? leagueMatch?.homeGoals.toString()
//                 : ""
//             }
//           />
//           <FormFieldError error={formState.errors?.homeGoals} />
//         </FormField>
//         <FormField>
//           <Label htmlFor="awayGoals">Away Goals</Label>
//           <Input
//             type="text"
//             id="awayGoals"
//             name="awayGoals"
//             defaultValue={
//               leagueMatch?.awayGoals !== null
//                 ? leagueMatch?.awayGoals.toString()
//                 : ""
//             }
//           />
//           <FormFieldError error={formState.errors?.awayGoals} />
//         </FormField>
//         <FormField>
//           <Label htmlFor="round">Round</Label>
//           <Input
//             type="text"
//             id="round"
//             name="round"
//             defaultValue={leagueMatch?.round || ""}
//           />
//           <FormFieldError error={formState.errors?.round} />
//         </FormField>

//         <SubmitButton
//           isDisabled={
//             !leagues ||
//             leagues.length <= 0 ||
//             isSeasonsLoading ||
//             !seasons ||
//             seasons.length <= 0 ||
//             // isGroupsLoading ||
//             // !groups ||
//             // groups.length <= 0 ||
//             isTeamsLoading ||
//             !seasonTeams ||
//             seasonTeams.length <= 0
//           }
//         />
//       </form>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LeagueMatch,
  LeagueTeam,
  League,
  LeagueSeason,
  LeagueGroup,
  Country,
} from "@prisma/client";

import { addLeagueMatch, updateLeagueMatch } from "@/actions/leagueMatches";

import PageHeader from "@/components/PageHeader";
import SubmitButton from "@/components/forms/parts/SubmitButton";
import FormField from "@/components/forms/parts/FormField";
import FormFieldError from "@/components/forms/parts/FormFieldError";
import FormFieldLoadingState from "@/components/forms/parts/FormFieldLoadingState";

import { Ban, Check } from "lucide-react";

import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from "@/components/ui/multiple-selector";

import { getDateValueForDateTimeInput } from "@/lib/getFormattedDate";

interface LeagueMatchProps extends LeagueMatch {
  season: LeagueSeasonProps;
  group: LeagueGroup | null;
  homeTeam: LeagueTeamProps;
  awayTeam: LeagueTeamProps;
}

interface LeagueSeasonProps extends LeagueSeason {
  league: LeagueProps;
}

interface LeagueProps extends League {
  country: Country | null;
}

interface LeagueTeamProps extends LeagueTeam {
  country: Country | null;
}

export default function LeagueMatchForm({
  leagueMatch,
}: {
  leagueMatch?: LeagueMatchProps | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [formState, formAction] = useFormState(
    leagueMatch == null
      ? addLeagueMatch
      : updateLeagueMatch.bind(null, leagueMatch.id),
    { errors: undefined, success: false, customError: null }
  );

  useEffect(() => {
    if (formState.success) {
      formRef.current?.reset();
      if (leagueMatch == null) {
        setHomeTeamValue(undefined);
        setHomeTeamKey(+new Date());

        setAwayTeamValue(undefined);
        setAwayTeamKey(+new Date());
      }
    }
  }, [formState]);

  const [selectedLeague, setSelectedLeague] = useState<Option[]>(
    leagueMatch
      ? [
          {
            dbValue: leagueMatch.season.league.id.toString(),
            label: `${leagueMatch.season.league.name} ${
              leagueMatch.season.league.country
                ? `(${leagueMatch.season.league.country.name})`
                : `(${leagueMatch.season.league.type})`
            }`,
            value: `${leagueMatch.season.league.name} ${
              leagueMatch.season.league.country
                ? `(${leagueMatch.season.league.country.name})`
                : `(${leagueMatch.season.league.type})`
            }`,
          },
        ]
      : []
  );

  const searchLeague = async (value: string): Promise<Option[]> => {
    return new Promise(async (resolve) => {
      const res = await fetch("/api/leagues/" + value);
      const data = await res.json();
      resolve(data);
    });
  };

  useEffect(() => {
    if (leagueMatch == null) {
      setSelectedSeason([]);
      setSeasonsKey(+new Date());

      setSelectedGroup([]);
      setGroupsKey(+new Date());
    }
  }, [selectedLeague, leagueMatch]);

  const [selectedSeason, setSelectedSeason] = useState<Option[]>(
    leagueMatch
      ? [
          {
            dbValue: leagueMatch?.seasonId.toString(),
            label: `${leagueMatch?.season.league.name} ${leagueMatch?.season.year}`,
            value: `${leagueMatch?.season.league.name} ${leagueMatch?.season.year}`,
          },
        ]
      : []
  );

  const searchSeason = async (value: string): Promise<Option[]> => {
    return new Promise(async (resolve) => {
      const res = await fetch(
        `/api/league-seasons/${selectedLeague[0].dbValue}/${value}`
      );
      const data = await res.json();
      resolve(data);
    });
  };

  const [seasonsKey, setSeasonsKey] = useState(+new Date());

  const seasonsRef = useRef<MultipleSelectorRef>(null);

  const [selectedGroup, setSelectedGroup] = useState<Option[]>(
    leagueMatch
      ? [
          {
            dbValue: leagueMatch?.groupId?.toString(),
            label: `${leagueMatch?.group?.name}`,
            value: `${leagueMatch?.group?.name}`,
          },
        ]
      : []
  );

  const searchGroup = async (value: string): Promise<Option[]> => {
    return new Promise(async (resolve) => {
      const res = await fetch(
        `/api/league-season-groups/${selectedSeason[0].dbValue}/${value}`
      );
      const data = await res.json();
      resolve(data);
    });
  };

  const [groupsKey, setGroupsKey] = useState(+new Date());

  const groupsRef = useRef<MultipleSelectorRef>(null);

  const [teams, setTeams] = useState<LeagueTeamProps[] | null>(null);

  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  useEffect(() => {
    async function getTeams() {
      setIsTeamsLoading(true);

      if (selectedGroup.length > 0) {
        const res = await fetch(
          "/api/league-groups-teams/" + selectedGroup[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
      } else if (selectedSeason.length > 0) {
        const res = await fetch(
          "/api/seasons-teams/" + selectedSeason[0].dbValue
        );
        const data = await res.json();

        setTeams(data.teams);
        // if (data.teams.length < 1) setSeasonTeams(null);
      } else {
        setTeams(null);
      }
      setIsTeamsLoading(false);
    }

    getTeams();
  }, [selectedSeason, selectedGroup]);

  const teamsRef = useRef<MultipleSelectorRef>(null);
  const [teamsKey, setTeamsKey] = useState(+new Date());

  const [homeTeamValue, setHomeTeamValue] = useState<string | undefined>(
    leagueMatch?.homeTeamId.toString() || undefined
  );

  const [homeTeamKey, setHomeTeamKey] = useState(+new Date());

  const [awayTeamValue, setAwayTeamValue] = useState<string | undefined>(
    leagueMatch?.awayTeamId.toString() || undefined
  );

  const [awayTeamKey, setAwayTeamKey] = useState(+new Date());

  return (
    <div className="overflow-auto px-4">
      <PageHeader
        label={leagueMatch ? "Edit League Match" : "Add League Match"}
      />
      {formState.success && (
        <p className="p-2 px-3 rounded-md w-full bg-emerald-500/10 text-emerald-500 text-lg mb-2 text-center flex items-center gap-2">
          <Check size={20} />
          Match has been {leagueMatch == null ? "added" : "updated"}{" "}
          successfully
        </p>
      )}
      {formState.customError && (
        <p className="p-2 px-3 rounded-md w-full bg-destructive/10 text-destructive text-lg mb-2 text-center flex items-center gap-2">
          <Ban size={20} />
          {formState.customError}
        </p>
      )}
      <form action={formAction} className="form-styles" ref={formRef}>
        <FormField>
          <Label htmlFor="leagueId">League</Label>
          <Input
            type="hidden"
            id="leagueId"
            name="leagueId"
            value={selectedLeague[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            onSearch={async (value) => {
              const res = await searchLeague(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select league"
            emptyIndicator={
              <p className="empty-indicator">No leagues found.</p>
            }
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                loading...
              </p>
            }
            onChange={setSelectedLeague}
            value={selectedLeague}
            disabled={!!leagueMatch}
          />
        </FormField>

        <FormField>
          <Label htmlFor="seasonId">Season</Label>
          <Input
            type="hidden"
            id="seasonId"
            name="seasonId"
            value={selectedSeason[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            key={seasonsKey}
            onSearch={async (value) => {
              const res = await searchSeason(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select season"
            emptyIndicator={
              <p className="empty-indicator">No seasons found.</p>
            }
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                loading...
              </p>
            }
            ref={seasonsRef}
            onChange={setSelectedSeason}
            value={selectedSeason}
            disabled={!!leagueMatch || selectedLeague.length === 0}
          />
        </FormField>

        <FormField>
          <Label htmlFor="groupId">Group</Label>
          <Input
            type="hidden"
            id="groupId"
            name="groupId"
            value={selectedGroup[0]?.dbValue || ""}
          />
          <MultipleSelector
            className="form-multiple-selector-styles"
            hidePlaceholderWhenSelected
            hideClearAllButton
            key={groupsKey}
            onSearch={async (value) => {
              const res = await searchGroup(value);
              return res;
            }}
            maxSelected={1}
            placeholder="Select group"
            emptyIndicator={<p className="empty-indicator">No groups found.</p>}
            loadingIndicator={
              <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                loading...
              </p>
            }
            ref={groupsRef}
            onChange={setSelectedGroup}
            value={selectedGroup}
            disabled={!!leagueMatch || selectedSeason.length === 0}
          />
        </FormField>

        <FormField>
          <div className="flex items-baseline gap-4 mt-2">
            <Label htmlFor="date">Date</Label>
            <span className="text-xs text-gray-500 font-semibold">
              Enter date-time in your local time
            </span>
          </div>
          <Input
            type="datetime-local"
            id="date"
            name="date"
            defaultValue={
              leagueMatch?.date
                ? getDateValueForDateTimeInput(leagueMatch?.date)
                : undefined
            }
          />
          <FormFieldError error={formState.errors?.date} />
        </FormField>

        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="homeTeamId">Home Team</Label>
            <Select
              name="homeTeamId"
              key={homeTeamKey}
              defaultValue={homeTeamValue}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Home Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(({ id, name, country }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}{" "}
                    {country ? (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground text-xs ml-2"
                      >
                        {`${country.name}`}
                      </Badge>
                    ) : (
                      ""
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={formState.errors?.homeTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}

        {teams && teams.length > 0 && !isTeamsLoading ? (
          <FormField>
            <Label htmlFor="awayTeamId">Away Team</Label>
            <Select
              name="awayTeamId"
              key={awayTeamKey}
              defaultValue={awayTeamValue}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Away Team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(({ id, name, country }) => (
                  <SelectItem value={id.toString()} key={id}>
                    {name}{" "}
                    {country ? (
                      <Badge
                        variant="secondary"
                        className="text-muted-foreground text-xs ml-2"
                      >
                        {`${country.name}`}
                      </Badge>
                    ) : (
                      ""
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={formState.errors?.awayTeamId} />
          </FormField>
        ) : (
          <FormFieldLoadingState
            isLoading={isTeamsLoading}
            label="Loading Teams..."
            notFoundText="There is no teams, add some!"
          />
        )}

        <FormField>
          <Label htmlFor="homeGoals">Home Goals</Label>
          <Input
            type="text"
            id="homeGoals"
            name="homeGoals"
            defaultValue={
              leagueMatch?.homeGoals !== null
                ? leagueMatch?.homeGoals.toString()
                : ""
            }
          />
          <FormFieldError error={formState.errors?.homeGoals} />
        </FormField>
        <FormField>
          <Label htmlFor="awayGoals">Away Goals</Label>
          <Input
            type="text"
            id="awayGoals"
            name="awayGoals"
            defaultValue={
              leagueMatch?.awayGoals !== null
                ? leagueMatch?.awayGoals.toString()
                : ""
            }
          />
          <FormFieldError error={formState.errors?.awayGoals} />
        </FormField>
        <FormField>
          <Label htmlFor="round">Round</Label>
          <Input
            type="text"
            id="round"
            name="round"
            defaultValue={leagueMatch?.round || ""}
          />
          <FormFieldError error={formState.errors?.round} />
        </FormField>

        <SubmitButton
          isDisabled={
            selectedLeague.length === 0 ||
            selectedSeason.length === 0 ||
            isTeamsLoading
          }
        />
      </form>
    </div>
  );
}
