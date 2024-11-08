"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function DropDownEdit() {
  return (
    <DropdownMenuItem
      className="items-center justify-center"
      asChild
      onSelect={(e) => e.preventDefault()}
    >
      <Button variant="ghost" className="w-full">
        Edit
      </Button>
    </DropdownMenuItem>
  );
}
