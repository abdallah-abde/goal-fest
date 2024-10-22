import Link from "next/link";

import { EllipsisVertical } from "lucide-react";

import { TableCell } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ActionsCellDropDown({
  editHref,
  children,
}: {
  editHref: string;
  children?: React.ReactNode | null;
}) {
  return (
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="h-5 sm:h-6 w-5 sm:w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-24 cursor-pointer" align="end">
          <DropdownMenuItem asChild className="items-center justify-center">
            <Link href={editHref} className="w-full cursor-pointer">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="items-center justify-center">
            <p className="w-full cursor-pointer">Delete</p>
          </DropdownMenuItem>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
}
