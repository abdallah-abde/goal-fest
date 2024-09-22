import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/db";
import Image from "next/image";
import * as _ from "lodash";

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  year: number;
}

export default async function TitleHoldersPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const [tournamentEdition, tournamentWinners] = await Promise.all([
    prisma.tournamentEdition.findUnique({
      where: {
        id: +params.editionId,
        tournamentId: +params.id,
      },
      include: {
        teams: true,
        tournament: true,
        winner: true,
        titleHolder: true,
        hostingCountries: true,
      },
    }),
    prisma.$queryRaw<
      WinnerProps[]
    >`SELECT winnerId, Team.name as teamName, Team.flagUrl, year from TournamentEdition, Team where TournamentEdition.tournamentId = ${+params.id} and winnerId = Team.id and currentStage = 'Finished' order by year desc`,
  ]);

  if (!tournamentEdition) throw new Error("Something went wrong");

  const results = Object.entries(_.groupBy(tournamentWinners, "teamName")).sort(
    (a, b) => {
      if (a[1].length > b[1].length) {
        return -1;
      } else {
        return 1;
      }
    }
  );

  return (
    <>
      <PageHeader
        label={`${tournamentEdition.tournament.name} Title Holders`}
      />
      {results &&
        results.length > 0 &&
        results.map(([teamName, data]) => (
          <div
            key={teamName}
            className='grid grid-cols-4 py-4 border-b border-primary/10 last:border-0 place-items-center place-content-center min-h-[80px]'
          >
            {data[0].flagUrl && (
              <Image
                width={40}
                height={40}
                src={data[0].flagUrl}
                alt={teamName + " Flag"}
                className='col-start-1 max-xs:w-8 max-xs:h-8'
              />
            )}
            <Badge
              variant='outline'
              className='col-start-2 text-[14px] xs:text-lg w-fit self-center border-0'
            >
              {teamName}
            </Badge>
            <Badge
              variant='gold'
              className='col-start-3 text-[14px] xs:text-lg w-fit self-center'
            >
              {data.length}
            </Badge>
            <div className='col-start-4 flex flex-wrap gap-1'>
              {data.map(({ winnerId, year }) => (
                <Badge
                  key={winnerId}
                  variant='green'
                  className='text-[11px] xs:text-sm mx-auto'
                >
                  {year}
                </Badge>
              ))}
            </div>
          </div>
        ))}
    </>
  );
}
