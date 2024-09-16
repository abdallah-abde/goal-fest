import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/db";
import Image from "next/image";
import * as _ from "lodash";

interface WinnerProps {
  winnerId: number;
  teamName: string;
  flagUrl: string;
  // count: number;
  year: number;
}

export default async function TitleHoldersPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: +params.id },
  });

  const tournamentWinners: WinnerProps[] =
    await prisma.$queryRaw`SELECT winnerId, Team.name as teamName, Team.flagUrl, year from TournamentEdition, Team where TournamentEdition.tournamentId = ${+params.id} and winnerId = Team.id and currentStage = 'Finished' order by year desc`;

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
      {tournament && (
        <div>
          <PageHeader label={`${tournament.name} Title Holders`} />
          <div>
            {results &&
              results.length > 0 &&
              results.map((winner) => (
                <div
                  key={winner[1][0].winnerId}
                  className='grid grid-cols-4 py-4 border-b border-primary/10 last:border-0 place-items-center place-content-center min-h-[80px]'
                >
                  {winner[1][0].flagUrl && (
                    <Image
                      width={40}
                      height={40}
                      src={winner[1][0].flagUrl}
                      alt=''
                      className='col-start-1 max-xs:w-8 max-xs:h-8'
                    />
                  )}
                  <Badge
                    variant='outline'
                    className='col-start-2 text-[14px] xs:text-lg w-fit self-center border-0'
                  >
                    {winner[0]}
                  </Badge>
                  <Badge
                    variant='gold'
                    className='col-start-3 text-[14px] xs:text-lg w-fit self-center'
                  >
                    {winner[1].length}
                  </Badge>
                  <div className='col-start-4 flex flex-wrap gap-1'>
                    {winner[1].map((y) => (
                      <Badge
                        key={y.winnerId}
                        variant='green'
                        className='text-[11px] xs:text-sm mx-auto'
                      >
                        {y.year}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
