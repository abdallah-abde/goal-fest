import { Suspense } from "react";

import MatchesCalender from "@/app/(pages)/_components/MatchesCalender";
import PopularMatches from "@/app/(pages)/_components/PopularMatches";
import CountriesMatches from "@/app/(pages)/_components/CountriesMatches";
import FeaturedMatches from "@/app/(pages)/_components/FeaturedMatches";
import PopularLeagues from "@/app/(pages)/_components/PopularLeagues";
import PopularTeams from "@/app/(pages)/_components/PopularTeams";
import Standings from "@/app/(pages)/_components/Standings";

import { standingsHeaders } from "@/lib/data/standingsHeaders";

import { getDateAsShortDate } from "@/lib/getFormattedDate";

export default async function HomePage({
  searchParams,
}: {
  searchParams: {
    date: string;
  };
}) {
  const date = searchParams?.date || getDateAsShortDate();

  return (
    <div className="h-screen py-24 flex gap-2 lg:gap-4 flex-col lg:flex-row">
      <div className="w-full lg:w-1/3 *:my-2">
        <MatchesCalender />
        <PopularMatches date={date} />
        <CountriesMatches date={date} />
      </div>
      <div className="w-full lg:w-2/3 lg:*:my-2">
        <FeaturedMatches />

        {/* <div>Goalers for most important leagues</div> */}

        <Standings values={standingsHeaders} date={date} />

        <div className="flex gap-2 lg:gap-4 pb-24 flex-col lg:flex-row">
          <div className="flex-1">
            {/* Popular Leagues */}
            <Suspense
              fallback={<p>Loading Popular Torunaments and Leagues...</p>}
            >
              <PopularLeagues />
            </Suspense>
          </div>
          <div className="flex-1">
            {/* Popular teams */}
            <Suspense fallback={<p>Loading Popular Teams...</p>}>
              <PopularTeams />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
