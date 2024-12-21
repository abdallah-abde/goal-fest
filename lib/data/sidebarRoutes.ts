import {
  Table2Icon,
  LandPlotIcon,
  HomeIcon,
  TrophyIcon,
  SquareStackIcon,
  BarChartIcon,
} from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export function getSidebarRoutes(params: Params) {
  const { slug } = params;

  return [
    {
      id: 1,
      label: "Info",
      href: `/leagues/${slug}/info`,
      Icon: HomeIcon,
    },
    {
      id: 2,
      label: "Standings",
      href: `/leagues/${slug}/standings`,
      Icon: Table2Icon,
    },
    {
      id: 3,
      label: "Matches",
      href: `/leagues/${slug}/matches`,
      Icon: LandPlotIcon,
    },
    {
      id: 4,
      label: "Stats",
      href: `/leagues/${slug}/stats`,
      Icon: BarChartIcon,
    },
    {
      id: 5,
      label: "History",
      href: `/leagues/${slug}/history`,
      Icon: SquareStackIcon,
    },
    {
      id: 6,
      label: "Title Holders",
      href: `/leagues/${slug}/title-holders`,
      Icon: TrophyIcon,
    },
  ];
}
