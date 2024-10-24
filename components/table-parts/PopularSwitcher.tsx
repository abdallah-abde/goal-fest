"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { updateLeaguePopularStatus } from "@/actions/leagues";
import { updateTournamentPopularStatus } from "@/actions/tournaments";

import { Switch } from "@/components/ui/switch";
import { LoadingSpinner } from "@/components/LoadingComponents";

export default function PopularSwitcher({
  id,
  isPopular,
  type,
}: {
  id: number;
  isPopular: boolean;
  type: "leagues" | "tournaments";
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>
      {!isPending ? (
        <Switch
          disabled={isPending}
          checked={isPopular}
          onCheckedChange={async (value) =>
            startTransition(async () => {
              type === "leagues"
                ? await updateLeaguePopularStatus(
                    id,
                    !isPopular,
                    searchParams.toString()
                  )
                : await updateTournamentPopularStatus(
                    id,
                    !isPopular,
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
