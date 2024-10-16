import prisma from "@/lib/db";

import Sidebar from "@/components/menus/Sidebar";

export default async function LeaguesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const slug = params.slug;

  const leagueSeason = await prisma.leagueSeason.findUnique({
    where: { slug },
    include: { league: true },
  });

  return (
    <div className="h-screen flex flex-col 2md:flex-row gap-4 py-24">
      {leagueSeason && (
        <Sidebar
          source="leagues"
          logoUrl={leagueSeason?.logoUrl || null}
          name={
            leagueSeason?.logoUrl
              ? `${leagueSeason?.league?.name} ${leagueSeason?.year}`
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
