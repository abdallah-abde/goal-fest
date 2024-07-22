import Sidebar from "@/components/Sidebar";
import prisma from "@/lib/db";

const TournamentLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { editionId: string };
}) => {
  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id: +params.editionId },
    include: { tournament: true },
  });

  return (
    <div className='h-screen flex flex-col md:flex-row gap-4 py-24'>
      <Sidebar
        logoUrl={
          tournamentEdition?.logoUrl
            ? tournamentEdition?.logoUrl
            : "/tournaments/tournament.png"
        }
        name={
          tournamentEdition?.logoUrl
            ? `${tournamentEdition?.tournament.name} ${tournamentEdition?.year}`
            : "Tournament Logo"
        }
      />
      <div className='md:overflow-auto grow md:pr-2 pb-24 md:pb-0'>
        {children}
      </div>
    </div>
  );
};

export default TournamentLayout;
