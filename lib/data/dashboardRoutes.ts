import {
  Table2,
  Home,
  Flag,
  ShieldHalf,
  LandPlot,
  Crown,
  Network,
} from "lucide-react";

export const dashboardTournamentsRoutes = [
  {
    id: 1,
    label: "Home Page",
    href: `/dashboard`,
    Icon: Home,
  },
  {
    id: 2,
    label: "Tournaments",
    href: `/dashboard/tournaments`,
    Icon: Crown,
  },
  {
    id: 3,
    label: "Editions",
    href: `/dashboard/editions`,
    Icon: Network,
  },
  {
    id: 4,
    label: "Teams",
    href: `/dashboard/teams`,
    Icon: ShieldHalf,
  },
  {
    id: 5,
    label: "Groups",
    href: `/dashboard/groups`,
    Icon: Table2,
  },
  {
    id: 6,
    label: "Matches",
    href: `/dashboard/matches`,
    Icon: LandPlot,
  },
  {
    id: 7,
    label: "Knockout Matches",
    href: `/dashboard/knockout-matches`,
    Icon: LandPlot,
  },
];

export const dashboardLeaguesRoutes = [
  {
    id: 1,
    label: "Home Page",
    href: `/dashboard`,
    Icon: Home,
  },
  {
    id: 2,
    label: "Leagues",
    href: `/dashboard/leagues`,
    Icon: Crown,
  },
  {
    id: 3,
    label: "Seasons",
    href: `/dashboard/seasons`,
    Icon: Network,
  },
  {
    id: 4,
    label: "Teams",
    href: `/dashboard/league-teams`,
    Icon: ShieldHalf,
  },
  {
    id: 5,
    label: "Groups",
    href: `/dashboard/league-groups`,
    Icon: Table2,
  },
  {
    id: 6,
    label: "Matches",
    href: `/dashboard/league-matches`,
    Icon: LandPlot,
  },
  {
    id: 7,
    label: "Knockout Matches",
    href: `/dashboard/league-knockout-matches`,
    Icon: LandPlot,
  },
];

export const dashboardOtherRoutes = [
  {
    id: 1,
    label: "Home Page",
    href: `/dashboard`,
    Icon: Home,
  },
  {
    id: 2,
    label: "Countries",
    href: `/dashboard/countries`,
    Icon: Flag,
  },
];
