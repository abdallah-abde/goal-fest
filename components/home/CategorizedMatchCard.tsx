import Image from "next/image";

import { NeutralMatch } from "@/types";

import { getFormattedTime } from "@/lib/getFormattedDate";

export default function CategorizedMatchCard({
  match,
}: {
  match: NeutralMatch;
}) {
  return (
    <div className="first:border-t-2 border-primary/25 border-b-2 bg-primary/20">
      <div className="flex items-center gap-4 p-2 py-4">
        <p className="flex-1 text-right text-sm">
          {match.homeTeam?.name || ""}
        </p>
        {match.homeTeam && match.homeTeam.flagUrl && (
          <Image
            width={25}
            height={25}
            src={match.homeTeam.flagUrl || ""}
            alt="team"
          />
        )}
        <p className="font-semibold text-sm">
          {(match.date &&
            getFormattedTime(match.date?.toString(), true, false)) ||
            ""}
        </p>
        {match.awayTeam && match.awayTeam.flagUrl && (
          <Image
            width={25}
            height={25}
            src={match.awayTeam.flagUrl || ""}
            alt="team"
          />
        )}
        <p className="flex-1 text-sm">{match.awayTeam?.name || ""}</p>
      </div>
    </div>
  );
}
