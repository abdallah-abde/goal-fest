import { FC } from "react";
import prisma from "@/lib/db";

import TournamentList from "@/components/TournamentList";

const HomePage: FC = async () => {
  const tournaments = await prisma.tournament.findMany();

  return <TournamentList tournaments={tournaments} />;
};

export default HomePage;
