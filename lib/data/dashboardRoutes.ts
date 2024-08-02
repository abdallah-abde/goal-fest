import {
  Table2,
  Home,
  Flag,
  ShieldHalf,
  LandPlot,
  Crown,
  Network,
} from "lucide-react";

export const routes = [
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
    label: "Countries",
    href: `/dashboard/countries`,
    Icon: Flag,
  },
  {
    id: 5,
    label: "Teams",
    href: `/dashboard/teams`,
    Icon: ShieldHalf,
  },
  {
    id: 6,
    label: "Groups",
    href: `/dashboard/groups`,
    Icon: Table2,
  },
  {
    id: 7,
    label: "Matches",
    href: `/dashboard/matches`,
    Icon: LandPlot,
  },
  {
    id: 8,
    label: "Knockout Matches",
    href: `/dashboard/knockout-matches`,
    Icon: LandPlot,
  },
];
