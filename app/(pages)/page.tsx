import prisma from "@/lib/db";

import TournamentsCards from "@/components/lists/cards/TournamentsCards";

export default async function HomePage() {
  const tournaments = await prisma.tournament.findMany();

  return <TournamentsCards tournaments={tournaments} />;
}
