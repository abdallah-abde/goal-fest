import { Suspense } from "react";

import MatchesCalender from "@/components/home/MatchesCalender";
import PopularMatches from "@/components/home/PopularMatches";
import CountriesMatches from "@/components/home/CountriesMatches";
import FeaturedMatches from "@/components/home/FeaturedMatches";
import Standings from "@/components/home/Standings";
import PopulatTournamentsAndLeagues from "@/components/home/PopularTournamentsAndLeagues";
import PopularTeams from "@/components/home/PopularTeams";

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
    <div className="h-screen py-24 flex gap-2">
      <div className="w-1/3 *:my-2">
        <MatchesCalender />
        <PopularMatches date={date} />
        <CountriesMatches date={date} />
      </div>
      <div className="w-2/3 *:my-2">
        <FeaturedMatches />

        {/* <div>Goalers for most important leagues</div> */}

        <Standings values={standingsHeaders} date={date} />

        <div className="flex gap-2 pb-24">
          <div className="flex-1">
            {/* Popular Leagues */}
            <Suspense fallback={<p>Loading Popular Torunaments and Leagues...</p>}>
              <PopulatTournamentsAndLeagues />
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
