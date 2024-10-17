export enum SortDirectionOptions {
  ASC = "asc",
  DESC = "desc",
}

export enum GroupByOptions {
  STAGE = "stage",
  ONLYDATE = "localDateOnlyDate", // Because we have Date in the Neutral Match Object
}

export enum TournamentStages {
  GroupsStage = "Groups Stage",
  RoundOf16 = "Round of 16",
  QuarterFinal = "Quarter Final",
  SemiFinal = "Semi Final",
  Final = "Final",
  Finished = "Finished",
}

export enum TournamentsOrLeaguesTypes {
  International = "International",
  Europe = "Europe",
  Asia = "Asia",
  Africa = "Africa",
  NorthAmerica = "North America",
  SouthAmerica = "South America",
  Oceanosia = "Oceanosia",
}

export enum IsPopularOptions {
  No = "No",
  Yes = "Yes",
}
