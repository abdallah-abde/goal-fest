import { FC } from "react";
import prisma from "@/lib/db";

import TournamentsList from "@/components/TournamentsList";

const HomePage: FC = async () => {
  const tournaments = await prisma.tournament.findMany();

  return <TournamentsList tournaments={tournaments} />;
};

export default HomePage;
