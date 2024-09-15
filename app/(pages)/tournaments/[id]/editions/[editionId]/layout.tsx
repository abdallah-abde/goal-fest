import Sidebar from "@/components/menus/Sidebar";
import prisma from "@/lib/db";

export default async function EditionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { editionId: string; id: string };
}) {
  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { id: +params.editionId, tournamentId: +params.id },
    include: { tournament: true },
  });

  return (
    <div className='h-screen flex flex-col 2md:flex-row gap-4 py-24'>
      {tournamentEdition && (
        <Sidebar
          logoUrl={tournamentEdition?.logoUrl || null}
          name={
            tournamentEdition?.logoUrl
              ? `${tournamentEdition?.tournament.name} ${tournamentEdition?.year}`
              : "Tournament Logo"
          }
        />
      )}
      <div className='2md:overflow-auto grow pl-1 2md:pr-2 pb-24 2md:pb-0 mt-8 2md:mt-0'>
        {children}
      </div>
    </div>
  );
}
