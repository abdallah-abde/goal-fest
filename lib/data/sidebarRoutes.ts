import { BracesIcon, Table2Icon, LandPlotIcon, HomeIcon } from "lucide-react";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export function getSidebarRoutes(params: Params) {
  return [
    {
      id: 1,
      label: "Tournament Page",
      href: `/tournaments/${params.id}/editions/${params.editionId}`,
      Icon: HomeIcon,
    },
    {
      id: 2,
      label: "Groups",
      href: `/tournaments/${params.id}/editions/${params.editionId}/groups`,
      Icon: Table2Icon,
    },
    {
      id: 3,
      label: "Groups Matches",
      href: `/tournaments/${params.id}/editions/${params.editionId}/matches`,
      Icon: LandPlotIcon,
    },
    {
      id: 4,
      label: "Knockout Brackets",
      href: `/tournaments/${params.id}/editions/${params.editionId}/knockout-brackets`,
      Icon: BracesIcon,
    },
    {
      id: 5,
      label: "Knockout Matches",
      href: `/tournaments/${params.id}/editions/${params.editionId}/knockout-matches`,
      Icon: LandPlotIcon,
    },
  ];
}
