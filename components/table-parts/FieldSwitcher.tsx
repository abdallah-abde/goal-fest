"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { updateGroupMatchFeaturedStatus } from "@/actions/groupMatches";
import { updateKnockoutMatchFeaturedStatus } from "@/actions/knockoutMatches";
import { updateLeagueMatchFeaturedStatus } from "@/actions/leagueMatches";
import { updateLeagueKnockoutMatchFeaturedStatus } from "@/actions/leagueKnockoutMatches";
import { updateLeaguePopularStatus } from "@/actions/leagues";
import { updateTournamentPopularStatus } from "@/actions/tournaments";

import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/LoadingComponents";

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
    | "tournaments";
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      {!isPending ? (
        <Switch
          disabled={isPending}
          checked={value}
          onCheckedChange={async (value) =>
            startTransition(async () => {
              type === "matches"
                ? await updateGroupMatchFeaturedStatus(
                    id,
                    !value,
                    searchParams.toString()
                  )
                : type === "knockoutMatches"
                ? await updateKnockoutMatchFeaturedStatus(
                    id,
                    !value,
                    searchParams.toString()
                  )
                : type === "leagueMatches"
                ? await updateLeagueMatchFeaturedStatus(
                    id,
                    !value,
                    searchParams.toString()
                  )
                : type === "leagueKnockoutMatches"
                ? await updateLeagueKnockoutMatchFeaturedStatus(
                    id,
                    !value,
                    searchParams.toString()
                  )
                : type === "leagues"
                ? await updateLeaguePopularStatus(
                    id,
                    !value,
                    searchParams.toString()
                  )
                : await updateTournamentPopularStatus(
                    id,
                    !value,
                    searchParams.toString()
                  );

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
