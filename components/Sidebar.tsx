"use client";

import { Braces, Table2, LandPlot, Home, Menu } from "lucide-react";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { useParams, usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <div
      className='flex flex-col md:border-r-2 md:pr-4 w-full md:min-w-52 md:max-w-52'
      onResize={() => console.log("resize")}
    >
      <div className='mx-auto h-[150px] w-[150px] mb-4 relative'>
        <Image
          fill
          src={logoUrl}
          alt={name + " Logo"}
          className='mx-auto object-contain'
        />
      </div>
      <div className={`space-y-2 overflow-auto hidden md:block`}>
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
      <Sheet>
        <SheetTrigger asChild>
          <Menu className='block md:hidden size-8 mx-auto mb-4 cursor-pointer' />
        </SheetTrigger>
        <SheetContent side='left'>
          <div className={`space-y-2 overflow-auto mt-4`}>
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
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
