"use client";

import { Braces, Table2, LandPlot } from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

const Sidebar = () => {
  const params = useParams();

  const routes = [
    {
      id: 1,
      label: "Groups",
      href: `/tournaments/${params.id}/editions/${params.editionId}/groups`,
      icon: <Table2 />,
    },
    {
      id: 2,
      label: "Matches",
      href: `/tournaments/${params.id}/editions/${params.editionId}/matches`,
      icon: <LandPlot />,
    },
    {
      id: 3,
      label: "Brackets",
      href: `/tournaments/${params.id}/editions/${params.editionId}/knockout_brackets`,
      icon: <Braces />,
    },
    {
      id: 4,
      label: "Knockout",
      href: `/tournaments/${params.id}/editions/${params.editionId}/knockout_matches`,
      icon: <LandPlot />,
    },
  ];

  return (
    <div className='flex flex-col w-20 fixed '>
      <div className=' space-y-4'>
        {routes.map((r) => (
          <Link
            key={r.id}
            className='flex flex-col items-center justify-center gap-y-1 text-sm text-primary rounded hover:bg-primary/10 transition duration-300 cursor-pointer py-2'
            href={r.href}
          >
            {r.icon}

            {r.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
