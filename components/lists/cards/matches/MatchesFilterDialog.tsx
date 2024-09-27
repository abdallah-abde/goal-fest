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
import { Input } from "@/components/ui/input";

import { Filter } from "lucide-react";

import FormField from "@/components/forms/parts/FormField";
import { Group, Team } from "@prisma/client";
import { ChangeEvent } from "react";

export default function MatchesFilterDialog({
  teams,
  groups,
  rounds,
}: {
  teams: Team[];
  groups: Group[];
  rounds: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const params = new URLSearchParams(searchParams);

  const teamId =
    (!isNaN(Number(params.get("teamId"))) ? params.get("teamId") : "all") ||
    "all";
  const groupId =
    (!isNaN(Number(params.get("groupId"))) ? params.get("groupId") : "all") ||
    "all";
  const round = params.get("round") || "all";
  const date = params.get("date") || "all";

  const pathname = usePathname();

  const handleParamChange = (e: string, par: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(par, e);
    router.push(`${pathname}?${newParams.toString()}`);
  };
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("date", e.target.value);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='flex gap-2 border-2 border-secondary hover:border-primary/10'
        >
          <Filter /> Filter Options
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
        </DialogHeader>
        <div className='form-styles py-4'>
          <FormField>
            <Label htmlFor='teamId'>Teams</Label>
            <Select
              name='teamId'
              value={teamId}
              onValueChange={(value) => handleParamChange(value, "teamId")}
            >
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Choose Team' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField>
            <Label htmlFor='groupId'>Groups</Label>
            <Select
              name='groupId'
              value={groupId}
              onValueChange={(value) => handleParamChange(value, "groupId")}
            >
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Choose Group' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField>
            <Label htmlFor='round'>Round</Label>
            <Select
              name='round'
              value={round}
              onValueChange={(value) => handleParamChange(value, "round")}
            >
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Choose Round' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Rounds</SelectItem>
                {rounds.map((round) => (
                  <SelectItem key={round} value={round}>
                    {round}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField>
            <Label htmlFor='date'>Date</Label>
            <Input type='date' name='date' onChange={handleDateChange} />
          </FormField>
        </div>
      </DialogContent>
    </Dialog>
  );
}
