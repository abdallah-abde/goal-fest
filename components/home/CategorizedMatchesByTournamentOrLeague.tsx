import _ from "lodash";
import Image from "next/image";
import { NeutralMatch } from "@/types";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CategorizedMatchCard from "@/components/home/CategorizedMatchCard";
import TorunamentOrLeagueAccordionLogo from "@/components/home/TorunamentOrLeagueAccordionLogo";
import PartsLink from "@/components/home/PartsLink";

export default function CategorizedMatchesByTournamentOrLeague({
  matches,
}: {
  matches: NeutralMatch[];
}) {
  const results = Object.entries(_.groupBy(matches, "fullTournamentName"));

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-primary/15 first:border-t-2 border-primary/50"
    >
      {results.map(([tournamentName, list], idx) => {
        const {
          editionOrSeason,
          editionOrSeasonLogoUrl,
          editionOrSeasonSlug,
          matchOf,
          tournamentOrLeagueName,
          fullTournamentName,
        } = list[0];

        return (
          <AccordionItem key={idx} value={tournamentName}>
            <AccordionTrigger className="px-4 pl-6 hover:no-underline">
              <div className="flex items-center gap-2">
                <div>
                  <Image
                    width={25}
                    height={25}
                    src={editionOrSeasonLogoUrl}
                    alt={fullTournamentName}
                  />
                  {/* <TorunamentOrLeagueAccordionLogo
                    type={matchOf}
                    editionOrSeason={editionOrSeason}
                    altText={fullTournamentName}
                  /> */}
                </div>
                <p className="flex-1">{tournamentOrLeagueName}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {list.map((match, idx) => (
                <CategorizedMatchCard key={idx} match={match} />
              ))}
              <PartsLink
                href={`/${matchOf}/${editionOrSeasonSlug}/standings`}
                label="See Standings"
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
