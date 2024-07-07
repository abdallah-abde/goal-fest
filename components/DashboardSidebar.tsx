"use client";

import { Table2, Home } from "lucide-react";

import Link from "next/link";

const DashboardSidebar = () => {
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
    ,
    {
      id: 3,
      label: "Editions",
      href: `/dashboard/editions`,
      icon: <Table2 />,
    },
  ];

  return (
    <div className='flex flex-col w-20 fixed'>
      <div className='space-y-1'>
        {routes.map((r) => (
          <Link
            key={r.id}
            className='flex flex-col items-center gap-y-1 text-sm text-primary rounded hover:bg-primary/10 transition duration-300 cursor-pointer py-2 text-center'
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

export default DashboardSidebar;
