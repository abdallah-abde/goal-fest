import {
  BracesIcon,
  Table2Icon,
  LandPlotIcon,
  HomeIcon,
  TrophyIcon,
  SquareStackIcon,
} from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export function getSidebarRoutes(params: Params) {
  const { id, editionId } = params;
  return [
    {
      id: 1,
      label: "Info",
      href: `/tournaments/${id}/editions/${editionId}/info`,
      Icon: HomeIcon,
    },
    {
      id: 2,
      label: "Groups",
      href: `/tournaments/${id}/editions/${editionId}/groups`,
      Icon: Table2Icon,
    },
    {
      id: 3,
      label: "Matches",
      href: `/tournaments/${id}/editions/${editionId}/matches`,
      Icon: LandPlotIcon,
    },
    {
      id: 4,
      label: "Brackets",
      href: `/tournaments/${id}/editions/${editionId}/knockout-brackets`,
      Icon: BracesIcon,
    },
    {
      id: 5,
      label: "History",
      href: `/tournaments/${id}/editions/${editionId}/history`,
      Icon: SquareStackIcon,
    },
    {
      id: 6,
      label: "Title Holders",
      href: `/tournaments/${id}/editions/${editionId}/title-holders`,
      Icon: TrophyIcon,
    },
  ];
}
