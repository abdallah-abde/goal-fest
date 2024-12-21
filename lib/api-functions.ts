import { Option } from "@/components/ui/multiple-selector";

export const searchLeague = async (value: string): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch("/api/leagues/" + value);
    const data = await res.json();
    resolve(data);
  });
};

export const searchSeason = async (
  value: string,
  selectedLeague?: string | undefined
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(`/api/league-seasons/${selectedLeague}/${value}`);
    const data = await res.json();
    resolve(data);
  });
};

export const searchLeagueGroup = async (
  value: string,
  selectedSeason: string | undefined
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(
      `/api/league-season-groups/${selectedSeason}/${value}`
    );
    const data = await res.json();
    resolve(data);
  });
};

export const searchCountry = async (value: string): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch("/api/countries/" + value);
    const data = await res.json();
    resolve(data);
  });
};

export const searchLeagueCountry = async (
  value: string,
  continent: string
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(`/api/countries/${value}/${continent}`);
    const data = await res.json();
    resolve(data);
  });
};

export const searchLeagueTeam = async (
  value: string,
  continent: string,
  country: number | null,
  isClubs: boolean,
  isDomestic: boolean
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(
      `/api/teams/${value}/${continent}/${country}/${isClubs}/${isDomestic}`
    );
    const data = await res.json();
    resolve(data);
  });
};

export const searchSeasonTeam = async (
  id: string | undefined,
  value: string
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(`/api/seasons-teams/${id}/${value}`);
    const data = await res.json();
    resolve(data);
  });
};

export const searchTeamMatch = async (
  value: string,
  seasonId: string | undefined,
  groupId: string | undefined
): Promise<Option[]> => {
  if (groupId) {
    return new Promise(async (resolve) => {
      const res = await fetch(
        `/api/match-teams/${value}/${seasonId}/${groupId}`
      );
      const data = await res.json();
      resolve(data);
    });
  } else {
    return new Promise(async (resolve) => {
      const res = await fetch(`/api/match-teams/${value}/${seasonId}`);
      const data = await res.json();
      resolve(data);
    });
  }
};
