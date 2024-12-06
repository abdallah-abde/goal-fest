export enum SortDirectionOptions {
  ASC = "asc",
  DESC = "desc",
}

export enum GroupByOptions {
  STAGE = "round",
  ONLYDATE = "date", // Because we have Date in the Neutral Match Object
}

export enum LeagueStages {
  GroupsStage = "Groups Stage",
  RoundOf16 = "Round of 16",
  QuarterFinal = "Quarter Final",
  SemiFinal = "Semi Final",
  Final = "Final",
  Finished = "Finished",
  Scheduled = "Scheduled",
  Running = "Running",
}

export enum TournamentTypes {
  International = "International",
  Europe = "Europe",
  Asia = "Asia",
  Africa = "Africa",
  NorthAmerica = "North America",
  SouthAmerica = "South America",
  Oceanosia = "Oceanosia",
}

export enum Continents {
  International = "International",
  Europe = "Europe",
  Asia = "Asia",
  Africa = "Africa",
  NorthAmerica = "North America",
  SouthAmerica = "South America",
  Oceanosia = "Oceanosia",
}

export enum LeagueTypes {
  Domestic = "Domestic",
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

export enum FlagFilterOptions {
  All = "All",
  Yes = "Yes",
  No = "No",
}

export enum MatchStatusOptions {
  Ended = "Ended",
  Postponed = "Postponed",
  Cancelled = "Cancelled",
  Playing = "Playing",
  Scheduled = "Scheduled",
}

export enum EmptyImageUrls {
  Team = "/images/teams/team-empty-logo.png",
  Country = "/images/countries/empty-flag.png",
  League = "/images/tournaments/tournament-empty-logo.png",
}
