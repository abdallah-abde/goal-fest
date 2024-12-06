import prisma from "@/lib/db";

import Sidebar from "@/components/menus/Sidebar";
import { EmptyImageUrls } from "@/types/enums";

export default async function EditionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = params;

  const edition = await prisma.tournamentEdition.findUnique({
    where: { slug },
    include: { tournament: true },
  });

  return (
    <div className="h-screen flex flex-col 2md:flex-row gap-4 py-24">
      {edition && (
        <Sidebar
          source="tournaments"
          logoUrl={edition.logoUrl || EmptyImageUrls.League}
          name={`${edition.tournament.name} ${edition.year}`}
        />
      )}
      <div className="2md:overflow-auto grow pl-1 2md:pr-2 pb-24 2md:pb-0 mt-8 2md:mt-0">
        {children}
      </div>
    </div>
  );
}
