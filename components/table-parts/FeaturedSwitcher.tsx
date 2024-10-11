"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { updateGroupMatchFeaturedStatus } from "@/actions/groupMatches";
import { updateKnockoutMatchFeaturedStatus } from "@/actions/knockoutMatches";
import { updateLeagueMatchFeaturedStatus } from "@/actions/leagueMatches";

import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/LoadingComponents";

export default function FeaturedSwitcher({
  id,
  isFeatured,
  type,
}: {
  id: number;
  isFeatured: boolean;
  type: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      {!isPending ? (
        <Switch
          disabled={isPending}
          checked={isFeatured}
          onCheckedChange={async (value) =>
            startTransition(async () => {
              type === "matches"
                ? await updateGroupMatchFeaturedStatus(
                    id,
                    !isFeatured,
                    searchParams.toString()
                  )
                : type === "knockoutMatches"
                ? await updateKnockoutMatchFeaturedStatus(
                    id,
                    !isFeatured,
                    searchParams.toString()
                  )
                : type === "leagueMatches"
                ? await updateLeagueMatchFeaturedStatus(
                    id,
                    !isFeatured,
                    searchParams.toString()
                  )
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
