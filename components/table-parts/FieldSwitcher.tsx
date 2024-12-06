"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateGroupMatchFeaturedStatus } from "@/actions/groupMatches";
import { updateKnockoutMatchFeaturedStatus } from "@/actions/knockoutMatches";
import { updateLeagueMatchFeaturedStatus } from "@/actions/leagueMatches";
import { updateLeagueKnockoutMatchFeaturedStatus } from "@/actions/leagueKnockoutMatches";
import { updateLeaguePopularStatus } from "@/actions/leagues";
import { updateTournamentPopularStatus } from "@/actions/tournaments";

import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/Skeletons";
import { updateLeagueTeamPopularStatus } from "@/actions/leagueTeams";

export default function FieldSwitcher({
  id,
  value,
  type,
}: {
  id: number;
  value: boolean;
  type:
    | "matches"
    | "knockoutMatches"
    | "leagueMatches"
    | "leagueKnockoutMatches"
    | "leagues"
    | "leagueTeams"
    | "tournaments";
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <>
      {!isPending ? (
        <Switch
          disabled={isPending}
          checked={value}
          onCheckedChange={async (value) =>
            startTransition(async () => {
              type === "matches"
                ? await updateGroupMatchFeaturedStatus(id, !value)
                : type === "knockoutMatches"
                ? await updateKnockoutMatchFeaturedStatus(id, !value)
                : type === "leagueMatches"
                ? await updateLeagueMatchFeaturedStatus(id, !value)
                : type === "leagueKnockoutMatches"
                ? await updateLeagueKnockoutMatchFeaturedStatus(id, !value)
                : type === "leagues"
                ? await updateLeaguePopularStatus(id, !value)
                : type === "leagueTeams"
                ? await updateLeagueTeamPopularStatus(id, !value)
                : await updateTournamentPopularStatus(id, !value);

              router.refresh();
            })
          }
        />
      ) : (
        <span>
          <LoadingSpinner />
        </span>
      )}
    </>
  );
}
