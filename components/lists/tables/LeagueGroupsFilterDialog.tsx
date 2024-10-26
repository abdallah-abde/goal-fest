"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Filter } from "lucide-react";

import FormField from "@/components/forms/parts/FormField";
import { LeagueGroup } from "@prisma/client";

export default function LeagueGroupsFilterDialog({
  groups,
}: {
  groups: LeagueGroup[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = new URLSearchParams(searchParams);

  const groupId =
    (!isNaN(Number(params.get("groupId"))) ? params.get("groupId") : "all") ||
    "all";

  const pathname = usePathname();

  const handleParamChange = (val: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("groupId", val);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 border-2 border-secondary hover:border-primary/10"
        >
          <Filter /> Filter Options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
        </DialogHeader>
        <div className="form-styles grid-cols-1 py-4">
          <FormField>
            <Label htmlFor="groupId">Groups</Label>
            <Select
              name="groupId"
              value={groupId}
              onValueChange={handleParamChange}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </DialogContent>
    </Dialog>
  );
}
