"use client";

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { useParams, usePathname } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import { getSidebarRoutes } from "@/lib/data/sidebarRoutes";
import { Menu } from "lucide-react";

export default function Sidebar({
  logoUrl,
  name,
  source,
}: {
  logoUrl?: string | null;
  name: string;
  source: "tournaments" | "leagues";
}) {
  const params = useParams();
  const pathname = usePathname();

  const routes = getSidebarRoutes(params, source);

  return (
    <div className="flex flex-col 2md:border-r-2 border-primary/10 2md:pr-4 w-full 2md:min-w-52 2md:max-w-52">
      {logoUrl && (
        <div className="mx-auto h-[140px] w-[140px] mb-2 relative">
          <Image
            fill
            src={logoUrl}
            alt={name + " Logo"}
            className="mx-auto object-contain"
          />
        </div>
      )}
      <div className={`space-y-2 pb-2 overflow-auto hidden 2md:block`}>
        {routes.map(({ id, href, label, Icon }) => (
          <Link
            key={id}
            className={cn(
              `m-1 px-2 flex items-center gap-4 text-sm text-primary rounded hover:bg-primary/10 transition duration-300 cursor-pointer py-2 text-center`,
              pathname === href && "bg-primary/10"
            )}
            href={href}
          >
            <div>
              <Icon />
            </div>

            <p>{label}</p>
          </Link>
        ))}
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="block 2md:hidden size-8 mx-auto mb-4 cursor-pointer fixed z-50 bg-primary text-secondary rounded-full p-1" />
        </SheetTrigger>
        <SheetContent side="left">
          <div className={`space-y-2 overflow-auto mt-4`}>
            {routes.map(({ id, href, label, Icon }) => (
              <SheetClose asChild key={id}>
                <Link
                  className={cn(
                    `m-1 px-2 flex items-center gap-x-4 text-sm text-primary rounded hover:bg-primary/10 transition duration-300 cursor-pointer py-2 text-center`,
                    pathname === href && "bg-primary/10"
                  )}
                  href={href}
                >
                  <div>
                    <Icon />
                  </div>

                  <p>{label}</p>
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
