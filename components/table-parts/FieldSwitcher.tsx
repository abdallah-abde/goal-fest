"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  updateMatchFeaturedStatus,
  updateMatchKnockoutStatus,
} from "@/actions/matches";
import {
  updateLeaguePopularStatus,
  updateLeagueIsClubsStatus,
  updateLeagueIsDomesticStatus,
} from "@/actions/leagues";
import {
  updateTeamPopularStatus,
  updateTeamIsClubStatus,
} from "@/actions/teams";

import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/Skeletons";

export default function FieldSwitcher({
  id,
  value,
  type,
  field,
}: {
  id: number;
  value: boolean;
  type: "matches" | "leagues" | "teams";
  field:
    | "isKnockout"
    | "isFeatured"
    | "isPopular"
    | "isClubs"
    | "isDomestic"
    | "isClub";
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
              type === "matches" && field === "isFeatured"
                ? await updateMatchFeaturedStatus(id, !value)
                : type === "matches" && field === "isKnockout"
                ? await updateMatchKnockoutStatus(id, !value)
                : type === "leagues" && field === "isPopular"
                ? await updateLeaguePopularStatus(id, !value)
                : type === "leagues" && field === "isClubs"
                ? await updateLeagueIsClubsStatus(id, !value)
                : type === "leagues" && field === "isDomestic"
                ? await updateLeagueIsDomesticStatus(id, !value)
                : type === "teams" && field === "isPopular"
                ? await updateTeamPopularStatus(id, !value)
                : type === "teams" && field === "isClub"
                ? await updateTeamIsClubStatus(id, !value)
                : null;

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
