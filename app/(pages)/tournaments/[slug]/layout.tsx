import prisma from "@/lib/db";

import Sidebar from "@/components/menus/Sidebar";

export default async function EditionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  const tournamentEdition = await prisma.tournamentEdition.findUnique({
    where: { slug },
    include: { tournament: true },
  });

  return (
    <div className="h-screen flex flex-col 2md:flex-row gap-4 py-24">
      {tournamentEdition && (
        <Sidebar
          source="tournaments"
          logoUrl={tournamentEdition?.logoUrl || null}
          name={
            tournamentEdition?.logoUrl
              ? `${tournamentEdition?.tournament.name} ${tournamentEdition?.year}`
              : "Tournament Logo"
          }
        />
      )}
      <div className="2md:overflow-auto grow pl-1 2md:pr-2 pb-24 2md:pb-0 mt-8 2md:mt-0">
        {children}
      </div>
    </div>
  );
}
