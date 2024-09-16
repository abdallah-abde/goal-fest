import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/db";
import Image from "next/image";

export default async function HistoryPage({
  params,
}: {
  params: { editionId: string; id: string };
}) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: +params.id },
    include: {
      tournamentEditions: {
        where: { currentStage: "Finished" },
        include: {
          hostingCountries: true,
          winner: true,
        },
        orderBy: {
          year: "desc",
        },
      },
    },
  });

  return (
    <>
      {tournament && (
        <div>
          <PageHeader label={`${tournament.name} History`} />
          <div>
            {tournament?.tournamentEditions &&
              tournament?.tournamentEditions.length > 0 &&
              tournament?.tournamentEditions.map((edition) => (
                <div
                  key={edition.id}
                  className='flex py-4 gap-4 border-b border-primary/10 last:border-0'
                >
                  {edition.logoUrl && (
                    <Image
                      width={100}
                      height={80}
                      src={edition.logoUrl}
                      alt=''
                    />
                  )}
                  <div className='flex flex-col gap-2'>
                    <Badge variant='outline' className='text-[16px] max-w-fit'>
                      {edition.year}
                    </Badge>
                    <div className='grid gap-2 grid-cols-[80px_1fr] grid-row-2'>
                      <span className='text-sm col-start-1 row-start-1 self-center'>
                        Hosted by
                      </span>
                      <div className='col-start-2 row-start-1 flex flex-wrap gap-2'>
                        {edition.hostingCountries.map((country) => (
                          <Badge
                            key={country.id}
                            variant='secondary'
                            className='flex gap-2 items-center '
                          >
                            {country.flagUrl && (
                              <Image
                                width={25}
                                height={25}
                                src={country.flagUrl}
                                alt=''
                              />
                            )}
                            <span>{country.name}</span>
                          </Badge>
                        ))}
                      </div>
                      <span className='text-sm col-start-1 row-start-2  self-center'>
                        Winner
                      </span>
                      {edition.winner && (
                        <Badge
                          variant='green'
                          className='flex gap-2 items-center col-start-2 row-start-2 max-w-fit'
                        >
                          {edition.winner.flagUrl && (
                            <Image
                              width={25}
                              height={25}
                              src={edition.winner.flagUrl}
                              alt=''
                            />
                          )}
                          <span>{edition.winner.name}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
