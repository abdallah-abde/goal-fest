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
    <div className='h-screen py-24 flex gap-x-4'>
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
      <div className='overflow-auto grow pr-2'>{children}</div>
    </div>
  );
};

export default TournamentLayout;
