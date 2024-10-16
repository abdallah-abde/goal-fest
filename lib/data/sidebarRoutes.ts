import {
  BracesIcon,
  Table2Icon,
  LandPlotIcon,
  HomeIcon,
  TrophyIcon,
  SquareStackIcon,
  BarChartIcon,
} from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export function getSidebarRoutes(
  params: Params,
  source: "tournaments" | "leagues"
) {
  const { slug } = params;

  if (source === "tournaments") {
    return [
      {
        id: 1,
        label: "Info",
        href: `/${source}/${slug}/info`,
        Icon: HomeIcon,
      },
      {
        id: 2,
        label: "Groups",
        href: `/${source}/${slug}/groups`,
        Icon: Table2Icon,
      },
      {
        id: 3,
        label: "Matches",
        href: `/${source}/${slug}/matches`,
        Icon: LandPlotIcon,
      },
      {
        id: 4,
        label: "Brackets",
        href: `/${source}/${slug}/knockout-brackets`,
        Icon: BracesIcon,
      },
      {
        id: 5,
        label: "Stats",
        href: `/${source}/${slug}/stats`,
        Icon: BarChartIcon,
      },
      {
        id: 6,
        label: "History",
        href: `/${source}/${slug}/history`,
        Icon: SquareStackIcon,
      },
      {
        id: 7,
        label: "Title Holders",
        href: `/${source}/${slug}/title-holders`,
        Icon: TrophyIcon,
      },
    ];
  } else {
    return [
      {
        id: 1,
        label: "Info",
        href: `/${source}/${slug}/info`,
        Icon: HomeIcon,
      },
      {
        id: 2,
        label: "Standings",
        href: `/${source}/${slug}/standings`,
        Icon: Table2Icon,
      },
      {
        id: 3,
        label: "Matches",
        href: `/${source}/${slug}/matches`,
        Icon: LandPlotIcon,
      },
      {
        id: 4,
        label: "Stats",
        href: `/${source}/${slug}/stats`,
        Icon: BarChartIcon,
      },
      {
        id: 5,
        label: "History",
        href: `/${source}/${slug}/history`,
        Icon: SquareStackIcon,
      },
      {
        id: 6,
        label: "Title Holders",
        href: `/${source}/${slug}/title-holders`,
        Icon: TrophyIcon,
      },
    ];
  }
}
