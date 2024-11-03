import Image from "next/image";

import { LeagueSeasonProps, TournamentEditionProps } from "@/types";

export default function TorunamentOrLeagueAccordionLogo({
  editionOrSeason,
  type,
  altText,
}: {
  editionOrSeason: TournamentEditionProps | LeagueSeasonProps | null;
  type: "tournaments" | "leagues";
  altText: string;
}) {
  if (!editionOrSeason) return <></>;

  return (
    <>
      {type === "tournaments" && editionOrSeason && editionOrSeason.logoUrl && (
        <RenderImage src={editionOrSeason.logoUrl} altText={altText} />
      )}
      {type === "leagues" && editionOrSeason && editionOrSeason.logoUrl ? (
        <RenderImage src={editionOrSeason.logoUrl} altText={altText} />
      ) : (
        (editionOrSeason as LeagueSeasonProps).league &&
        (editionOrSeason as LeagueSeasonProps).league.logoUrl && (
          <RenderImage
            src={(editionOrSeason as LeagueSeasonProps).league.logoUrl || ""}
            altText={altText}
          />
        )
      )}
    </>
  );
}

function RenderImage({ src, altText }: { src: string; altText: string }) {
  return <Image src={src} alt={altText} width={25} height={25} />;
}
