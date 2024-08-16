"use client";

import Link from "next/link";

import { Group, Tournament, TournamentEdition } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

interface props {
  id: number;
  groupName: string;
  tournamentEditionId: number;
  tournamentName: string;
  editionYear: number;
}

export const columns: ColumnDef<props>[] = [
  {
    id: "group",
    accessorKey: "groupName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Group' />
    ),

    cell: ({ row }) => {
      return (
        <div className='text-left font-medium'>{row.original.groupName}</div>
      );
    },
  },
  {
    id: "tournament",
    accessorKey: "tournamentName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tournament' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-left font-medium'>
          {row.original.tournamentName.toString()}
        </div>
      );
    },
  },
  {
    id: "year",
    accessorKey: "editionYear",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Year' />
    ),
    cell: ({ row }) => {
      return (
        <div className='text-left font-medium'>
          {row.original.editionYear.toString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowValues = row.original;

      return (
        <div className='text-right'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <EllipsisVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='min-w-fit cursor-pointer'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className='flex items-center justify-center'
              >
                <Link
                  href={`/dashboard/groups/${rowValues.id.toString()}`}
                  className='cursor-pointer'
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className='flex items-center justify-center'
              >
                <p className='cursor-pointer'>Delete</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
