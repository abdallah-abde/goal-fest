"use client";

import { Braces, Table2, LandPlot, Home } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { useParams, usePathname } from "next/navigation";

const Sidebar = ({ logoUrl, name }: { logoUrl: string; name: string }) => {
  const params = useParams();
  const pathname = usePathname();

  const routes = [
    {
      id: 1,
      label: "Tournament Page",
      href: `/tournaments/${params.id}/editions/${params.editionId}`,
      icon: <Home />,
    },
    {
      id: 2,
      label: "Groups",
      href: `/tournaments/${params.id}/editions/${params.editionId}/groups`,
      icon: <Table2 />,
    },
    {
      id: 3,
      label: "Groups Matches",
      href: `/tournaments/${params.id}/editions/${params.editionId}/matches`,
      icon: <LandPlot />,
    },
    {
      id: 4,
      label: "Knockout Brackets",
      href: `/tournaments/${params.id}/editions/${params.editionId}/knockout_brackets`,
      icon: <Braces />,
    },
    {
      id: 5,
      label: "Knockout Matches",
      href: `/tournaments/${params.id}/editions/${params.editionId}/knockout_matches`,
      icon: <LandPlot />,
    },
  ];

  return (
    <div className='flex flex-col border-r-2 pr-4 min-w-max'>
      <div className='flex items-center justify-center mb-4'>
        <Image width={200} height={200} src={logoUrl} alt={name + " Logo"} />
      </div>
      <div className='space-y-2 overflow-auto'>
        {routes.map((r) => (
          <Link
            key={r.id}
            className={cn(
              `px-2 flex items-center gap-x-4 text-sm text-primary rounded hover:bg-primary/10 transition duration-300 cursor-pointer py-2 text-center`,
              pathname === r.href && "bg-primary/10"
            )}
            href={r.href}
          >
            <div>{r.icon}</div>

            <p>{r.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
