import {
  Table2Icon,
  LandPlotIcon,
  HomeIcon,
  TrophyIcon,
  SquareStackIcon,
  BarChartIcon,
} from "lucide-react";
import { TiInfoLargeOutline } from "react-icons/ti";
import { BsInfoSquare } from "react-icons/bs";
import { LuTableOfContents } from "react-icons/lu";
import { TbSoccerField } from "react-icons/tb";
import { IoStatsChart } from "react-icons/io5";
import { GiTrophiesShelf } from "react-icons/gi";
import { GiDiamondTrophy } from "react-icons/gi";

import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export function getSidebarRoutes(params: Params) {
  const { slug } = params;

  return [
    {
      id: 1,
      label: "Info",
      href: `/leagues/${slug}/info`,
      Icon: BsInfoSquare,
    },
    {
      id: 2,
      label: "Standings",
      href: `/leagues/${slug}/standings`,
      Icon: LuTableOfContents,
    },
    {
      id: 3,
      label: "Matches",
      href: `/leagues/${slug}/matches`,
      Icon: TbSoccerField,
    },
    {
      id: 4,
      label: "Stats",
      href: `/leagues/${slug}/stats`,
      Icon: IoStatsChart,
    },
    {
      id: 5,
      label: "History",
      href: `/leagues/${slug}/history`,
      Icon: GiTrophiesShelf,
    },
    {
      id: 6,
      label: "Title Holders",
      href: `/leagues/${slug}/title-holders`,
      Icon: GiDiamondTrophy,
    },
  ];
}
