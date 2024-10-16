import Image from "next/image";

import MatchesCalender from "@/components/home/MatchesCalender";
import PopularMatches from "@/components/home/PopularMatches";
import CountriesMatches from "@/components/home/CountriesMatches";
import FeaturedMatches from "@/components/home/FeaturedMatches";
import Standings from "@/components/home/Standings";

import { homePageStandingsHeaders } from "@/lib/data/homePageStandingsHeaders";

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

        <Standings values={homePageStandingsHeaders} date={date} />

        <div className="flex gap-2 pb-24">
          <div className="flex-1">
            {/* Popular Leagues */}
            <div className="bg-primary/10 *:border-b">
              <h3 className="text-center text-lg py-2">Popular Leagues</h3>
              <div className="flex flex-col items-start justify-center gap-2 *:border-b">
                {Array.from({ length: 10 }).map((a, idx) => (
                  <div
                    key={idx}
                    className="w-full flex gap-4 items-center px-4 py-2"
                  >
                    <Image
                      width={25}
                      height={25}
                      src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                      alt="team"
                    />
                    <p className="font-semibold text-sm">League 1</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            {/* Popular teams */}
            <div className="bg-primary/10 *:border-b">
              <h3 className="text-center text-lg py-2">Popular Teams</h3>
              <div className="flex flex-col items-start justify-center gap-2 *:border-b">
                {Array.from({ length: 10 }).map((a, idx) => (
                  <div
                    key={idx}
                    className="w-full flex gap-4 items-center px-4 py-2"
                  >
                    <Image
                      width={25}
                      height={25}
                      src="/images/teams/d87feb39-e41a-4237-9ee0-7749ef89d50e-germany (1).png"
                      alt="team"
                    />
                    <p className="font-semibold text-sm">Team 1</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
