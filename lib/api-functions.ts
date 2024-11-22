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

export const searchTournament = async (value: string): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch("/api/tournaments/" + value);
    const data = await res.json();
    resolve(data);
  });
};

export const searchEdition = async (
  value: string,
  selectedTournament?: string | undefined
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(
      `/api/tournament-editions/${selectedTournament}/${value}`
    );
    const data = await res.json();
    resolve(data);
  });
};

export const searchGroup = async (
  value: string,
  selectedEdition: string | undefined
): Promise<Option[]> => {
  return new Promise(async (resolve) => {
    const res = await fetch(
      `/api/tournament-edition-groups/${selectedEdition}/${value}`
    );
    const data = await res.json();
    resolve(data);
  });
};
