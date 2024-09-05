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
}: {
  editHref: string;
}) {
  return (
    <TableCell className='text-right'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='min-w-24 cursor-pointer' align='end'>
          <DropdownMenuItem asChild className='items-center justify-center'>
            <Link href={editHref} className='w-full cursor-pointer'>
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className='items-center justify-center'>
            <p className='w-full cursor-pointer'>Delete</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
}
