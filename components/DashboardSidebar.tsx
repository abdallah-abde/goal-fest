"use client";

import { Table2, Home, Flag, ShieldHalf, Group, Braces } from "lucide-react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const pathname = usePathname();

  const routes = [
    {
      id: 1,
      label: "Home Page",
      href: `/dashboard`,
      icon: <Home />,
    },
    {
      id: 2,
      label: "Tournaments",
      href: `/dashboard/tournaments`,
      icon: <Table2 />,
    },
    {
      id: 3,
      label: "Editions",
      href: `/dashboard/editions`,
      icon: <Table2 />,
    },
    {
      id: 4,
      label: "Countries",
      href: `/dashboard/countries`,
      icon: <Flag />,
    },
    {
      id: 5,
      label: "Teams",
      href: `/dashboard/teams`,
      icon: <ShieldHalf />,
    },
    {
      id: 6,
      label: "Groups",
      href: `/dashboard/groups`,
      icon: <Group />,
    },
    {
      id: 7,
      label: "Matches",
      href: `/dashboard/matches`,
      icon: <Braces />,
    },
    {
      id: 8,
      label: "Knockout Matches",
      href: `/dashboard/knockout-matches`,
      icon: <Braces />,
    },
  ];

  return (
    <div className='flex flex-col border-r-2 pr-4 min-w-max'>
      <div className='space-y-2 overflow-auto'>
        {routes.map((r) => (
          <Link
            key={r.id}
            className={cn(
              `px-2 flex items-center gap-x-4 text-sm text-primary rounded hover:bg-primary/10 transition duration-300 cursor-pointer py-2 text-center`,
              pathname === r.href
                ? "bg-primary/10"
                : pathname.includes(r.href) && r.href !== "/dashboard"
                ? "bg-primary/10"
                : ""
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

export default DashboardSidebar;
